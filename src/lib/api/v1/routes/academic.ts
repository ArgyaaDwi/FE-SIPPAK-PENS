import { Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import prisma from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/encrypt";
import { normalizePredictionOutput } from "@/lib/utils";

const academicRouter = new Hono();

type AcademicRole = "KADEP" | "KAPRODI" | "DOSEN_WALI" | "WALI_MURID";
type StatusKey = "tinggi" | "sedang" | "rendah" | "unknown";
type StatusCounts = Record<StatusKey, number>;

type SessionContext = {
  userId: number;
  role: AcademicRole;
};

type LatestPrediction = {
  id: string;
  output: string;
  prob_rendah: number;
  prob_sedang: number;
  prob_tinggi: number;
  createdAt: Date;
};

type StudentWithLatestPrediction = {
  id: string;
  nama: string;
  angkatan: number;
  prediksi: LatestPrediction[];
};

function emptyStatusCounts(): StatusCounts {
  return {
    tinggi: 0,
    sedang: 0,
    rendah: 0,
    unknown: 0,
  };
}

function getLatestPredictionStatus(
  mahasiswa: StudentWithLatestPrediction,
): StatusKey {
  const latestPrediction = mahasiswa.prediksi[0];

  if (!latestPrediction) {
    return "unknown";
  }

  return normalizePredictionOutput(latestPrediction.output);
}

function addStudentStatus(
  counts: StatusCounts,
  mahasiswa: StudentWithLatestPrediction,
) {
  const status = getLatestPredictionStatus(mahasiswa);
  counts[status] += 1;
}

function mapLatestPrediction(mahasiswa: StudentWithLatestPrediction) {
  const latestPrediction = mahasiswa.prediksi[0];

  if (!latestPrediction) {
    return null;
  }

  return {
    id: latestPrediction.id,
    output: latestPrediction.output,
    status: normalizePredictionOutput(latestPrediction.output),
    probability: {
      rendah: latestPrediction.prob_rendah,
      sedang: latestPrediction.prob_sedang,
      tinggi: latestPrediction.prob_tinggi,
    },
    createdAt: latestPrediction.createdAt,
  };
}

async function requireSession(c: Context) {
  const token =
    getCookie(c, "session") || c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return { error: "Unauthorized", status: 401 as const };
  }

  const session = await verifySessionToken(token);
  const role = String(session?.role ?? "");

  if (!session?.user_id || !isAcademicRole(role)) {
    return { error: "Invalid session", status: 401 as const };
  }

  return {
    session: {
      userId: Number(session.user_id),
      role,
    },
  };
}

function isAcademicRole(role: string): role is AcademicRole {
  return (
    role === "KADEP" ||
    role === "KAPRODI" ||
    role === "DOSEN_WALI" ||
    role === "WALI_MURID"
  );
}

function parseId(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

function parseAngkatan(angkatan?: string) {
  if (!angkatan) {
    return null;
  }

  const parsedAngkatan = Number(angkatan);

  if (!Number.isInteger(parsedAngkatan) || parsedAngkatan <= 0) {
    return null;
  }

  return parsedAngkatan;
}

function prodiAccessWhere(session: SessionContext) {
  if (session.role === "KADEP") {
    return {
      deleted: false,
      departemen: {
        deleted: false,
        kadep_id: session.userId,
      },
    };
  }

  if (session.role === "KAPRODI") {
    return {
      deleted: false,
      kaprodi_id: session.userId,
    };
  }

  if (session.role === "DOSEN_WALI") {
    return {
      deleted: false,
      kelas: {
        some: {
          deleted: false,
          dosen_wali_id: session.userId,
        },
      },
    };
  }

  return {
    deleted: false,
    kelas: {
      some: {
        deleted: false,
        mahasiswa: {
          some: {
            deleted: false,
            wali_id: session.userId,
          },
        },
      },
    },
  };
}

function kelasAccessWhere(session: SessionContext) {
  if (session.role === "KADEP") {
    return {
      deleted: false,
      prodi: {
        deleted: false,
        departemen: {
          deleted: false,
          kadep_id: session.userId,
        },
      },
    };
  }

  if (session.role === "KAPRODI") {
    return {
      deleted: false,
      prodi: {
        deleted: false,
        kaprodi_id: session.userId,
      },
    };
  }

  if (session.role === "DOSEN_WALI") {
    return {
      deleted: false,
      dosen_wali_id: session.userId,
    };
  }

  return {
    deleted: false,
    mahasiswa: {
      some: {
        deleted: false,
        wali_id: session.userId,
      },
    },
  };
}

function mahasiswaAccessWhere(session: SessionContext) {
  if (session.role === "KADEP") {
    return {
      deleted: false,
      kelas: {
        deleted: false,
        prodi: {
          deleted: false,
          departemen: {
            deleted: false,
            kadep_id: session.userId,
          },
        },
      },
    };
  }

  if (session.role === "KAPRODI") {
    return {
      deleted: false,
      kelas: {
        deleted: false,
        prodi: {
          deleted: false,
          kaprodi_id: session.userId,
        },
      },
    };
  }

  if (session.role === "DOSEN_WALI") {
    return {
      deleted: false,
      kelas: {
        deleted: false,
        dosen_wali_id: session.userId,
      },
    };
  }

  return {
    deleted: false,
    wali_id: session.userId,
  };
}

const latestPredictionInclude = {
  where: {
    deleted: false,
  },
  orderBy: {
    createdAt: "desc" as const,
  },
  take: 1,
  select: {
    id: true,
    output: true,
    prob_rendah: true,
    prob_sedang: true,
    prob_tinggi: true,
    createdAt: true,
  },
};

academicRouter.get("/prodi", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const prodiList = await prisma.prodi.findMany({
      where: prodiAccessWhere(auth.session),
      orderBy: {
        nama: "asc",
      },
      include: {
        departemen: {
          select: {
            id: true,
            nama: true,
          },
        },
        kelas: {
          where: {
            deleted: false,
          },
          include: {
            mahasiswa: {
              where: {
                deleted: false,
              },
              select: {
                id: true,
                nama: true,
                angkatan: true,
                prediksi: latestPredictionInclude,
              },
            },
          },
        },
      },
    });

    const data = prodiList.map((prodi) => {
      const statusCounts = emptyStatusCounts();
      const totalMahasiswa = prodi.kelas.reduce((total, kelas) => {
        kelas.mahasiswa.forEach((mahasiswa) =>
          addStudentStatus(statusCounts, mahasiswa),
        );
        return total + kelas.mahasiswa.length;
      }, 0);

      return {
        id: prodi.id,
        nama: prodi.nama,
        departemen: prodi.departemen,
        totalKelas: prodi.kelas.length,
        totalMahasiswa,
        performance: statusCounts,
      };
    });

    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error("Academic Prodi List Error:", error);
    return c.json({ success: false, error: "Gagal memuat prodi" }, 500);
  }
});

academicRouter.get("/prodi/:prodiId", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const prodiId = parseId(c.req.param("prodiId"));

    if (!prodiId) {
      return c.json({ success: false, error: "ID prodi tidak valid" }, 400);
    }

    const prodi = await prisma.prodi.findFirst({
      where: {
        id: prodiId,
        ...prodiAccessWhere(auth.session),
      },
      include: {
        departemen: {
          select: {
            id: true,
            nama: true,
          },
        },
        kelas: {
          where: {
            deleted: false,
          },
          orderBy: {
            nama: "asc",
          },
          include: {
            mahasiswa: {
              where: {
                deleted: false,
              },
              select: {
                id: true,
                nama: true,
                angkatan: true,
                prediksi: latestPredictionInclude,
              },
            },
          },
        },
      },
    });

    if (!prodi) {
      return c.json({ success: false, error: "Prodi tidak ditemukan" }, 404);
    }

    const performance = emptyStatusCounts();
    const kelas = prodi.kelas.map((kelasItem) => {
      const classPerformance = emptyStatusCounts();

      kelasItem.mahasiswa.forEach((mahasiswa) => {
        addStudentStatus(performance, mahasiswa);
        addStudentStatus(classPerformance, mahasiswa);
      });

      return {
        id: kelasItem.id,
        nama: kelasItem.nama,
        angkatan: kelasItem.angkatan,
        totalMahasiswa: kelasItem.mahasiswa.length,
        performance: classPerformance,
      };
    });

    return c.json(
      {
        success: true,
        data: {
          id: prodi.id,
          nama: prodi.nama,
          departemen: prodi.departemen,
          totalKelas: kelas.length,
          totalMahasiswa: kelas.reduce(
            (total, kelasItem) => total + kelasItem.totalMahasiswa,
            0,
          ),
          performance,
          kelas,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Academic Prodi Detail Error:", error);
    return c.json({ success: false, error: "Gagal memuat detail prodi" }, 500);
  }
});

academicRouter.get("/prodi/:prodiId/kelas", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const prodiId = parseId(c.req.param("prodiId"));

    if (!prodiId) {
      return c.json({ success: false, error: "ID prodi tidak valid" }, 400);
    }

    const kelasList = await prisma.kelas.findMany({
      where: {
        prodi_id: prodiId,
        ...kelasAccessWhere(auth.session),
      },
      orderBy: [
        {
          angkatan: "desc",
        },
        {
          nama: "asc",
        },
      ],
      include: {
        prodi: {
          select: {
            id: true,
            nama: true,
          },
        },
        mahasiswa: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            nama: true,
            angkatan: true,
            prediksi: latestPredictionInclude,
          },
        },
      },
    });

    const data = kelasList.map((kelas) => {
      const performance = emptyStatusCounts();
      kelas.mahasiswa.forEach((mahasiswa) =>
        addStudentStatus(performance, mahasiswa),
      );

      return {
        id: kelas.id,
        nama: kelas.nama,
        angkatan: kelas.angkatan,
        prodi: kelas.prodi,
        totalMahasiswa: kelas.mahasiswa.length,
        performance,
      };
    });

    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error("Academic Kelas List Error:", error);
    return c.json({ success: false, error: "Gagal memuat kelas" }, 500);
  }
});

academicRouter.get("/kelas", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const prodiIdParam = c.req.query("prodi_id");
    const prodiId = prodiIdParam ? parseId(prodiIdParam) : null;

    if (prodiIdParam && !prodiId) {
      return c.json({ success: false, error: "ID prodi tidak valid" }, 400);
    }

    const kelasList = await prisma.kelas.findMany({
      where: {
        ...(prodiId ? { prodi_id: prodiId } : {}),
        ...kelasAccessWhere(auth.session),
      },
      orderBy: [
        {
          angkatan: "desc",
        },
        {
          nama: "asc",
        },
      ],
      include: {
        prodi: {
          select: {
            id: true,
            nama: true,
          },
        },
        mahasiswa: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            nama: true,
            angkatan: true,
            prediksi: latestPredictionInclude,
          },
        },
      },
    });

    const data = kelasList.map((kelas) => {
      const performance = emptyStatusCounts();
      kelas.mahasiswa.forEach((mahasiswa) =>
        addStudentStatus(performance, mahasiswa),
      );

      return {
        id: kelas.id,
        nama: kelas.nama,
        angkatan: kelas.angkatan,
        prodi: kelas.prodi,
        totalMahasiswa: kelas.mahasiswa.length,
        performance,
      };
    });

    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error("Academic All Kelas List Error:", error);
    return c.json({ success: false, error: "Gagal memuat kelas" }, 500);
  }
});

academicRouter.get("/kelas/:kelasId", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const kelasId = parseId(c.req.param("kelasId"));

    if (!kelasId) {
      return c.json({ success: false, error: "ID kelas tidak valid" }, 400);
    }

    const kelas = await prisma.kelas.findFirst({
      where: {
        id: kelasId,
        ...kelasAccessWhere(auth.session),
      },
      include: {
        prodi: {
          select: {
            id: true,
            nama: true,
          },
        },
        mahasiswa: {
          where: {
            deleted: false,
          },
          orderBy: {
            nama: "asc",
          },
          select: {
            id: true,
            nama: true,
            angkatan: true,
            prediksi: latestPredictionInclude,
          },
        },
      },
    });

    if (!kelas) {
      return c.json({ success: false, error: "Kelas tidak ditemukan" }, 404);
    }

    const performance = emptyStatusCounts();
    const mahasiswa = kelas.mahasiswa.map((item) => {
      addStudentStatus(performance, item);

      return {
        id: item.id,
        nama: item.nama,
        angkatan: item.angkatan,
        latestPrediction: mapLatestPrediction(item),
      };
    });

    return c.json(
      {
        success: true,
        data: {
          id: kelas.id,
          nama: kelas.nama,
          angkatan: kelas.angkatan,
          prodi: kelas.prodi,
          totalMahasiswa: mahasiswa.length,
          performance,
          mahasiswa,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Academic Kelas Detail Error:", error);
    return c.json({ success: false, error: "Gagal memuat detail kelas" }, 500);
  }
});

academicRouter.get("/kelas/:kelasId/mahasiswa", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const kelasId = parseId(c.req.param("kelasId"));

    if (!kelasId) {
      return c.json({ success: false, error: "ID kelas tidak valid" }, 400);
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: {
        kelas_id: kelasId,
        ...mahasiswaAccessWhere(auth.session),
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
        angkatan: true,
        kelas: {
          select: {
            id: true,
            nama: true,
            angkatan: true,
            prodi: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        prediksi: latestPredictionInclude,
      },
    });

    const data = mahasiswa.map((item) => ({
      id: item.id,
      nama: item.nama,
      angkatan: item.angkatan,
      kelas: item.kelas,
      latestPrediction: mapLatestPrediction(item),
    }));

    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error("Academic Mahasiswa List Error:", error);
    return c.json({ success: false, error: "Gagal memuat mahasiswa" }, 500);
  }
});

academicRouter.get("/mahasiswa", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const kelasIdParam = c.req.query("kelas_id");
    const kelasId = kelasIdParam ? parseId(kelasIdParam) : null;

    if (kelasIdParam && !kelasId) {
      return c.json({ success: false, error: "ID kelas tidak valid" }, 400);
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: {
        ...(kelasId ? { kelas_id: kelasId } : {}),
        ...mahasiswaAccessWhere(auth.session),
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
        angkatan: true,
        kelas: {
          select: {
            id: true,
            nama: true,
            angkatan: true,
            prodi: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        prediksi: latestPredictionInclude,
      },
    });

    const data = mahasiswa.map((item) => ({
      id: item.id,
      nama: item.nama,
      angkatan: item.angkatan,
      kelas: item.kelas,
      latestPrediction: mapLatestPrediction(item),
    }));

    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error("Academic All Mahasiswa List Error:", error);
    return c.json({ success: false, error: "Gagal memuat mahasiswa" }, 500);
  }
});

academicRouter.get("/predictions", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const angkatanParam = c.req.query("angkatan");
    const angkatan = parseAngkatan(angkatanParam);

    if (angkatanParam && !angkatan) {
      return c.json({ success: false, error: "Angkatan tidak valid" }, 400);
    }

    const predictions = await prisma.prediksi.findMany({
      where: {
        deleted: false,
        mahasiswa: {
          ...(angkatan ? { angkatan } : {}),
          ...mahasiswaAccessWhere(auth.session),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        output: true,
        prob_rendah: true,
        prob_sedang: true,
        prob_tinggi: true,
        createdAt: true,
        mahasiswa: {
          select: {
            id: true,
            nama: true,
            angkatan: true,
            kelas: {
              select: {
                id: true,
                nama: true,
                angkatan: true,
                prodi: {
                  select: {
                    id: true,
                    nama: true,
                    departemen: {
                      select: {
                        id: true,
                        nama: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        created_by_user: {
          select: {
            id: true,
            nama: true,
            role: true,
          },
        },
      },
    });

    const data = predictions.map((prediction) => ({
      id: prediction.id,
      output: prediction.output,
      status: normalizePredictionOutput(prediction.output),
      probability: {
        rendah: prediction.prob_rendah,
        sedang: prediction.prob_sedang,
        tinggi: prediction.prob_tinggi,
      },
      createdAt: prediction.createdAt,
      mahasiswa: prediction.mahasiswa,
      createdBy: prediction.created_by_user,
    }));

    return c.json(
      {
        success: true,
        filters: {
          angkatan,
        },
        total: data.length,
        data,
      },
      200,
    );
  } catch (error) {
    console.error("Academic Prediction List Error:", error);
    return c.json({ success: false, error: "Gagal memuat prediksi" }, 500);
  }
});

academicRouter.get("/prediksi", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const angkatanParam = c.req.query("angkatan");
    const angkatan = parseAngkatan(angkatanParam);

    if (angkatanParam && !angkatan) {
      return c.json({ success: false, error: "Angkatan tidak valid" }, 400);
    }

    const predictions = await prisma.prediksi.findMany({
      where: {
        deleted: false,
        mahasiswa: {
          ...(angkatan ? { angkatan } : {}),
          ...mahasiswaAccessWhere(auth.session),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        output: true,
        prob_rendah: true,
        prob_sedang: true,
        prob_tinggi: true,
        createdAt: true,
        mahasiswa: {
          select: {
            id: true,
            nama: true,
            angkatan: true,
            kelas: {
              select: {
                id: true,
                nama: true,
                angkatan: true,
                prodi: {
                  select: {
                    id: true,
                    nama: true,
                    departemen: {
                      select: {
                        id: true,
                        nama: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        created_by_user: {
          select: {
            id: true,
            nama: true,
            role: true,
          },
        },
      },
    });

    const data = predictions.map((prediction) => ({
      id: prediction.id,
      output: prediction.output,
      status: normalizePredictionOutput(prediction.output),
      probability: {
        rendah: prediction.prob_rendah,
        sedang: prediction.prob_sedang,
        tinggi: prediction.prob_tinggi,
      },
      createdAt: prediction.createdAt,
      mahasiswa: prediction.mahasiswa,
      createdBy: prediction.created_by_user,
    }));

    return c.json(
      {
        success: true,
        filters: {
          angkatan,
        },
        total: data.length,
        data,
      },
      200,
    );
  } catch (error) {
    console.error("Academic Prediksi List Error:", error);
    return c.json({ success: false, error: "Gagal memuat prediksi" }, 500);
  }
});

academicRouter.get("/mahasiswa/:mahasiswaId", async (c) => {
  try {
    const auth = await requireSession(c);

    if ("error" in auth) {
      return c.json({ success: false, error: auth.error }, auth.status);
    }

    const mahasiswaId = c.req.param("mahasiswaId");

    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        id: mahasiswaId,
        ...mahasiswaAccessWhere(auth.session),
      },
      include: {
        kelas: {
          select: {
            id: true,
            nama: true,
            angkatan: true,
            prodi: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        prediksi: {
          where: {
            deleted: false,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            output: true,
            prob_rendah: true,
            prob_sedang: true,
            prob_tinggi: true,
            createdAt: true,
          },
        },
      },
    });

    if (!mahasiswa) {
      return c.json(
        { success: false, error: "Mahasiswa tidak ditemukan" },
        404,
      );
    }

    return c.json(
      {
        success: true,
        data: {
          id: mahasiswa.id,
          nama: mahasiswa.nama,
          angkatan: mahasiswa.angkatan,
          kelas: mahasiswa.kelas,
          latestPrediction: mapLatestPrediction(mahasiswa),
          predictions: mahasiswa.prediksi.map((prediksi) => ({
            id: prediksi.id,
            output: prediksi.output,
            status: normalizePredictionOutput(prediksi.output),
            probability: {
              rendah: prediksi.prob_rendah,
              sedang: prediksi.prob_sedang,
              tinggi: prediksi.prob_tinggi,
            },
            createdAt: prediksi.createdAt,
          })),
        },
      },
      200,
    );
  } catch (error) {
    console.error("Academic Mahasiswa Detail Error:", error);
    return c.json(
      { success: false, error: "Gagal memuat detail mahasiswa" },
      500,
    );
  }
});

export default academicRouter;
