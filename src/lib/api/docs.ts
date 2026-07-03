const authSecurity = [{ sessionCookie: [] }, { bearerAuth: [] }];

const jsonRef = (ref: string) => ({
  "application/json": {
    schema: { $ref: ref },
  },
});

const errorResponses = {
  400: {
    description: "Request tidak valid",
    content: jsonRef("#/components/schemas/ErrorResponse"),
  },
  401: {
    description: "Unauthorized",
    content: jsonRef("#/components/schemas/ErrorResponse"),
  },
  500: {
    description: "Terjadi kesalahan pada server",
    content: jsonRef("#/components/schemas/ErrorResponse"),
  },
};

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Predict API",
    version: "1.1.0",
    description:
      "Dokumentasi lengkap untuk endpoint autentikasi, akademik, penyimpanan prediksi, proxy prediksi backend, dan endpoint dokumentasi.",
  },
  servers: [
    {
      url: "/",
      description: "Current application origin",
    },
  ],
  tags: [
    { name: "Auth", description: "Autentikasi dan sesi" },
    { name: "Mahasiswa", description: "Dropdown mahasiswa berdasarkan akses user" },
    { name: "Prediksi", description: "Simpan hasil prediksi ke database" },
    { name: "Academic", description: "Data akademik bertingkat untuk dashboard" },
    { name: "Prediction Proxy", description: "Proxy ke backend model prediksi" },
    { name: "Documentation", description: "Swagger UI dan OpenAPI JSON" },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "session",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        required: ["success", "error"],
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Unauthorized" },
        },
      },
      ProxyErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            example: "Backend prediction failed (HTTP 422)",
          },
          detail: {
            type: "string",
            nullable: true,
            example: '{"detail":"payload tidak valid"}',
          },
        },
      },
      Role: {
        type: "string",
        enum: ["KADEP", "KAPRODI", "DOSEN_WALI", "WALI_MURID"],
        example: "KAPRODI",
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "kaprodi@kampus.ac.id",
          },
          password: {
            type: "string",
            format: "password",
            example: "rahasia123",
          },
        },
      },
      LoginResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login berhasil" },
          data: {
            type: "object",
            required: ["token", "role"],
            properties: {
              token: { type: "string", example: "jwt-token" },
              role: { $ref: "#/components/schemas/Role" },
            },
          },
        },
      },
      LogoutResponse: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Logout berhasil" },
        },
      },
      SessionPayload: {
        type: "object",
        required: [
          "user_id",
          "nama",
          "email",
          "role",
          "created_at",
          "expiresAt",
        ],
        properties: {
          user_id: { type: "integer", example: 12 },
          nama: { type: "string", example: "Budi Santoso" },
          email: {
            type: "string",
            format: "email",
            example: "budi@kampus.ac.id",
          },
          role: { $ref: "#/components/schemas/Role" },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-06-29T08:00:00.000Z",
          },
          expiresAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-30T08:00:00.000Z",
          },
        },
      },
      AuthMeResponse: {
        type: "object",
        required: ["success", "payload"],
        properties: {
          success: { type: "boolean", example: true },
          payload: { $ref: "#/components/schemas/SessionPayload" },
        },
      },
      MahasiswaItem: {
        type: "object",
        required: ["id", "nama"],
        properties: {
          id: { type: "string", example: "3122600001" },
          nama: { type: "string", example: "Budi Santoso" },
        },
      },
      MahasiswaDropdownResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/MahasiswaItem" },
          },
        },
      },
      PredictRequest: {
        type: "object",
        required: [
          "mahasiswa_id",
          "payload_input",
          "output",
          "prob_rendah",
          "prob_sedang",
          "prob_tinggi",
        ],
        properties: {
          mahasiswa_id: { type: "string", example: "3122600001" },
          payload_input: {
            type: "object",
            additionalProperties: true,
            example: {
              ips_1: 3.2,
              ips_2: 3.1,
              sks_total: 84,
              is_kipk: 0,
              is_non_kipk: 1,
            },
          },
          output: { type: "string", example: "Tinggi" },
          prob_rendah: { type: "number", format: "float", example: 0.1 },
          prob_sedang: { type: "number", format: "float", example: 0.2 },
          prob_tinggi: { type: "number", format: "float", example: 0.7 },
        },
      },
      PredictionRecord: {
        type: "object",
        required: [
          "id",
          "mahasiswa_id",
          "created_by",
          "payload_input",
          "output",
          "prob_rendah",
          "prob_sedang",
          "prob_tinggi",
          "createdAt",
          "deleted",
        ],
        properties: {
          id: { type: "string", example: "cmd123abc" },
          mahasiswa_id: { type: "string", example: "3122600001" },
          created_by: { type: "integer", example: 12 },
          payload_input: {
            type: "object",
            additionalProperties: true,
          },
          output: { type: "string", example: "Tinggi" },
          prob_rendah: { type: "number", format: "float", example: 0.1 },
          prob_sedang: { type: "number", format: "float", example: 0.2 },
          prob_tinggi: { type: "number", format: "float", example: 0.7 },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-29T08:30:00.000Z",
          },
          deleted: { type: "boolean", example: false },
        },
      },
      PredictSaveResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Prediksi disimpan!" },
          data: { $ref: "#/components/schemas/PredictionRecord" },
        },
      },
      PredictionProbability: {
        type: "object",
        required: ["rendah", "sedang", "tinggi"],
        properties: {
          rendah: { type: "number", format: "float", example: 0.1 },
          sedang: { type: "number", format: "float", example: 0.2 },
          tinggi: { type: "number", format: "float", example: 0.7 },
        },
      },
      PredictionStatus: {
        type: "string",
        enum: ["tinggi", "sedang", "rendah", "unknown"],
        example: "tinggi",
      },
      LatestPrediction: {
        type: "object",
        required: ["id", "output", "status", "probability", "createdAt"],
        properties: {
          id: { type: "string", example: "cmd123abc" },
          output: { type: "string", example: "Tinggi" },
          status: { $ref: "#/components/schemas/PredictionStatus" },
          probability: {
            $ref: "#/components/schemas/PredictionProbability",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-29T08:30:00.000Z",
          },
        },
      },
      PerformanceCounts: {
        type: "object",
        required: ["tinggi", "sedang", "rendah", "unknown"],
        properties: {
          tinggi: { type: "integer", example: 12 },
          sedang: { type: "integer", example: 6 },
          rendah: { type: "integer", example: 2 },
          unknown: { type: "integer", example: 1 },
        },
      },
      DepartemenBrief: {
        type: "object",
        required: ["id", "nama"],
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "Teknik Informatika" },
        },
      },
      ProdiBrief: {
        type: "object",
        required: ["id", "nama"],
        properties: {
          id: { type: "integer", example: 3 },
          nama: { type: "string", example: "D4 Teknik Informatika" },
        },
      },
      ProdiWithDepartemenBrief: {
        type: "object",
        required: ["id", "nama", "departemen"],
        properties: {
          id: { type: "integer", example: 3 },
          nama: { type: "string", example: "D4 Teknik Informatika" },
          departemen: { $ref: "#/components/schemas/DepartemenBrief" },
        },
      },
      KelasBrief: {
        type: "object",
        required: ["id", "nama", "angkatan"],
        properties: {
          id: { type: "integer", example: 7 },
          nama: { type: "string", example: "TI-4A" },
          angkatan: { type: "integer", example: 2022 },
        },
      },
      KelasWithProdiBrief: {
        type: "object",
        required: ["id", "nama", "angkatan", "prodi"],
        properties: {
          id: { type: "integer", example: 7 },
          nama: { type: "string", example: "TI-4A" },
          angkatan: { type: "integer", example: 2022 },
          prodi: { $ref: "#/components/schemas/ProdiBrief" },
        },
      },
      StudentListItem: {
        type: "object",
        required: [
          "id",
          "nama",
          "angkatan",
          "actualCategoryIpk",
          "kelas",
          "latestPrediction",
        ],
        properties: {
          id: { type: "string", example: "3122600001" },
          nama: { type: "string", example: "Budi Santoso" },
          angkatan: { type: "integer", example: 2022 },
          actualCategoryIpk: {
            type: "string",
            nullable: true,
            example: "Tinggi",
          },
          kelas: { $ref: "#/components/schemas/KelasWithProdiBrief" },
          latestPrediction: {
            allOf: [{ $ref: "#/components/schemas/LatestPrediction" }],
            nullable: true,
          },
        },
      },
      KelasStudentItem: {
        type: "object",
        required: ["id", "nama", "angkatan", "latestPrediction"],
        properties: {
          id: { type: "string", example: "3122600001" },
          nama: { type: "string", example: "Budi Santoso" },
          angkatan: { type: "integer", example: 2022 },
          latestPrediction: {
            allOf: [{ $ref: "#/components/schemas/LatestPrediction" }],
            nullable: true,
          },
        },
      },
      ProdiListItem: {
        type: "object",
        required: [
          "id",
          "nama",
          "departemen",
          "totalKelas",
          "totalMahasiswa",
          "performance",
        ],
        properties: {
          id: { type: "integer", example: 3 },
          nama: { type: "string", example: "D4 Teknik Informatika" },
          departemen: { $ref: "#/components/schemas/DepartemenBrief" },
          totalKelas: { type: "integer", example: 4 },
          totalMahasiswa: { type: "integer", example: 120 },
          performance: { $ref: "#/components/schemas/PerformanceCounts" },
        },
      },
      ProdiDetailKelasItem: {
        type: "object",
        required: ["id", "nama", "angkatan", "totalMahasiswa", "performance"],
        properties: {
          id: { type: "integer", example: 7 },
          nama: { type: "string", example: "TI-4A" },
          angkatan: { type: "integer", example: 2022 },
          totalMahasiswa: { type: "integer", example: 30 },
          performance: { $ref: "#/components/schemas/PerformanceCounts" },
        },
      },
      ProdiDetailData: {
        type: "object",
        required: [
          "id",
          "nama",
          "departemen",
          "totalKelas",
          "totalMahasiswa",
          "performance",
          "kelas",
        ],
        properties: {
          id: { type: "integer", example: 3 },
          nama: { type: "string", example: "D4 Teknik Informatika" },
          departemen: { $ref: "#/components/schemas/DepartemenBrief" },
          totalKelas: { type: "integer", example: 4 },
          totalMahasiswa: { type: "integer", example: 120 },
          performance: { $ref: "#/components/schemas/PerformanceCounts" },
          kelas: {
            type: "array",
            items: { $ref: "#/components/schemas/ProdiDetailKelasItem" },
          },
        },
      },
      KelasListItem: {
        type: "object",
        required: [
          "id",
          "nama",
          "angkatan",
          "prodi",
          "totalMahasiswa",
          "performance",
        ],
        properties: {
          id: { type: "integer", example: 7 },
          nama: { type: "string", example: "TI-4A" },
          angkatan: { type: "integer", example: 2022 },
          prodi: { $ref: "#/components/schemas/ProdiBrief" },
          totalMahasiswa: { type: "integer", example: 30 },
          performance: { $ref: "#/components/schemas/PerformanceCounts" },
        },
      },
      KelasDetailData: {
        type: "object",
        required: [
          "id",
          "nama",
          "angkatan",
          "prodi",
          "totalMahasiswa",
          "performance",
          "mahasiswa",
        ],
        properties: {
          id: { type: "integer", example: 7 },
          nama: { type: "string", example: "TI-4A" },
          angkatan: { type: "integer", example: 2022 },
          prodi: { $ref: "#/components/schemas/ProdiBrief" },
          totalMahasiswa: { type: "integer", example: 30 },
          performance: { $ref: "#/components/schemas/PerformanceCounts" },
          mahasiswa: {
            type: "array",
            items: { $ref: "#/components/schemas/KelasStudentItem" },
          },
        },
      },
      StudentDetailData: {
        type: "object",
        required: [
          "id",
          "nama",
          "angkatan",
          "actualIpk",
          "actualCategoryIpk",
          "kelas",
          "latestPrediction",
          "predictions",
        ],
        properties: {
          id: { type: "string", example: "3122600001" },
          nama: { type: "string", example: "Budi Santoso" },
          angkatan: { type: "integer", example: 2022 },
          actualIpk: {
            type: "number",
            format: "float",
            nullable: true,
            example: 3.45,
          },
          actualCategoryIpk: {
            type: "string",
            nullable: true,
            example: "Tinggi",
          },
          kelas: { $ref: "#/components/schemas/KelasWithProdiBrief" },
          latestPrediction: {
            allOf: [{ $ref: "#/components/schemas/LatestPrediction" }],
            nullable: true,
          },
          predictions: {
            type: "array",
            items: { $ref: "#/components/schemas/LatestPrediction" },
          },
        },
      },
      PredictionListItem: {
        type: "object",
        required: [
          "id",
          "output",
          "status",
          "probability",
          "createdAt",
          "mahasiswa",
          "createdBy",
        ],
        properties: {
          id: { type: "string", example: "cmd123abc" },
          output: { type: "string", example: "Tinggi" },
          status: { $ref: "#/components/schemas/PredictionStatus" },
          probability: {
            $ref: "#/components/schemas/PredictionProbability",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-29T08:30:00.000Z",
          },
          mahasiswa: {
            type: "object",
            required: ["id", "nama", "angkatan", "kelas"],
            properties: {
              id: { type: "string", example: "3122600001" },
              nama: { type: "string", example: "Budi Santoso" },
              angkatan: { type: "integer", example: 2022 },
              kelas: {
                type: "object",
                required: ["id", "nama", "angkatan", "prodi"],
                properties: {
                  id: { type: "integer", example: 7 },
                  nama: { type: "string", example: "TI-4A" },
                  angkatan: { type: "integer", example: 2022 },
                  prodi: {
                    type: "object",
                    required: ["id", "nama", "departemen"],
                    properties: {
                      id: { type: "integer", example: 3 },
                      nama: {
                        type: "string",
                        example: "D4 Teknik Informatika",
                      },
                      departemen: {
                        $ref: "#/components/schemas/DepartemenBrief",
                      },
                    },
                  },
                },
              },
            },
          },
          createdBy: {
            type: "object",
            required: ["id", "nama", "role"],
            properties: {
              id: { type: "integer", example: 12 },
              nama: { type: "string", example: "Ketua Prodi" },
              role: { $ref: "#/components/schemas/Role" },
            },
          },
        },
      },
      ProdiListResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/ProdiListItem" },
          },
        },
      },
      ProdiDetailResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/ProdiDetailData" },
        },
      },
      KelasListResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/KelasListItem" },
          },
        },
      },
      KelasDetailResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/KelasDetailData" },
        },
      },
      StudentListResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/StudentListItem" },
          },
        },
      },
      StudentDetailResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/StudentDetailData" },
        },
      },
      PredictionListResponse: {
        type: "object",
        required: ["success", "filters", "total", "data"],
        properties: {
          success: { type: "boolean", example: true },
          filters: {
            type: "object",
            required: ["angkatan"],
            properties: {
              angkatan: {
                type: "integer",
                nullable: true,
                example: 2022,
              },
            },
          },
          total: { type: "integer", example: 10 },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/PredictionListItem" },
          },
        },
      },
      GenericObjectResponse: {
        type: "object",
        additionalProperties: true,
        example: {
          prediction: "Tinggi",
          probabilities: {
            rendah: 0.1,
            sedang: 0.2,
            tinggi: 0.7,
          },
        },
      },
    },
  },
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: jsonRef("#/components/schemas/LoginRequest"),
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: jsonRef("#/components/schemas/LoginResponse"),
          },
          400: {
            description: "Email dan password wajib diisi",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Password salah",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          404: {
            description: "User tidak ditemukan",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Terjadi kesalahan pada server",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: {
          200: {
            description: "Logout berhasil",
            content: jsonRef("#/components/schemas/LogoutResponse"),
          },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Cek sesi login",
        security: authSecurity,
        responses: {
          200: {
            description: "Sesi valid",
            content: jsonRef("#/components/schemas/AuthMeResponse"),
          },
          401: {
            description: "Belum login atau token tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memvalidasi sesi",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/mahasiswa": {
      get: {
        tags: ["Mahasiswa"],
        summary: "Ambil daftar mahasiswa untuk dropdown",
        security: authSecurity,
        responses: {
          200: {
            description: "Daftar mahasiswa berhasil dimuat",
            content: jsonRef("#/components/schemas/MahasiswaDropdownResponse"),
          },
          401: {
            description: "Unauthorized atau token tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat mahasiswa",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/predict": {
      post: {
        tags: ["Prediksi"],
        summary: "Simpan hasil prediksi ke database",
        security: authSecurity,
        requestBody: {
          required: true,
          content: jsonRef("#/components/schemas/PredictRequest"),
        },
        responses: {
          201: {
            description: "Prediksi berhasil disimpan",
            content: jsonRef("#/components/schemas/PredictSaveResponse"),
          },
          400: {
            description: "Mahasiswa wajib dipilih",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized atau token tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          403: {
            description: "Mahasiswa di luar cakupan akses akun",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal menyimpan prediksi ke database",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/prodi": {
      get: {
        tags: ["Academic"],
        summary: "Daftar prodi yang dapat diakses user",
        security: authSecurity,
        responses: {
          200: {
            description: "Daftar prodi berhasil dimuat",
            content: jsonRef("#/components/schemas/ProdiListResponse"),
          },
          ...errorResponses,
        },
      },
    },
    "/api/v1/academic/prodi/{prodiId}": {
      get: {
        tags: ["Academic"],
        summary: "Detail prodi beserta rekap kelas",
        security: authSecurity,
        parameters: [
          {
            name: "prodiId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID prodi",
          },
        ],
        responses: {
          200: {
            description: "Detail prodi berhasil dimuat",
            content: jsonRef("#/components/schemas/ProdiDetailResponse"),
          },
          400: {
            description: "ID prodi tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          404: {
            description: "Prodi tidak ditemukan",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat detail prodi",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/prodi/{prodiId}/kelas": {
      get: {
        tags: ["Academic"],
        summary: "Daftar kelas berdasarkan prodi",
        security: authSecurity,
        parameters: [
          {
            name: "prodiId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID prodi",
          },
        ],
        responses: {
          200: {
            description: "Daftar kelas berhasil dimuat",
            content: jsonRef("#/components/schemas/KelasListResponse"),
          },
          400: {
            description: "ID prodi tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat kelas",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/kelas": {
      get: {
        tags: ["Academic"],
        summary: "Daftar seluruh kelas sesuai akses user",
        security: authSecurity,
        parameters: [
          {
            name: "prodi_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan ID prodi",
          },
        ],
        responses: {
          200: {
            description: "Daftar kelas berhasil dimuat",
            content: jsonRef("#/components/schemas/KelasListResponse"),
          },
          400: {
            description: "ID prodi tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat kelas",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/kelas/{kelasId}": {
      get: {
        tags: ["Academic"],
        summary: "Detail kelas beserta mahasiswa dan prediksi terakhir",
        security: authSecurity,
        parameters: [
          {
            name: "kelasId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kelas",
          },
        ],
        responses: {
          200: {
            description: "Detail kelas berhasil dimuat",
            content: jsonRef("#/components/schemas/KelasDetailResponse"),
          },
          400: {
            description: "ID kelas tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          404: {
            description: "Kelas tidak ditemukan",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat detail kelas",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/kelas/{kelasId}/mahasiswa": {
      get: {
        tags: ["Academic"],
        summary: "Daftar mahasiswa berdasarkan kelas",
        security: authSecurity,
        parameters: [
          {
            name: "kelasId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kelas",
          },
        ],
        responses: {
          200: {
            description: "Daftar mahasiswa berhasil dimuat",
            content: jsonRef("#/components/schemas/StudentListResponse"),
          },
          400: {
            description: "ID kelas tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat mahasiswa",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/mahasiswa": {
      get: {
        tags: ["Academic"],
        summary: "Daftar mahasiswa akademik",
        security: authSecurity,
        parameters: [
          {
            name: "kelas_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan ID kelas",
          },
        ],
        responses: {
          200: {
            description: "Daftar mahasiswa berhasil dimuat",
            content: jsonRef("#/components/schemas/StudentListResponse"),
          },
          400: {
            description: "ID kelas tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat mahasiswa",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/mahasiswa/{mahasiswaId}": {
      get: {
        tags: ["Academic"],
        summary: "Detail mahasiswa dan riwayat prediksi",
        security: authSecurity,
        parameters: [
          {
            name: "mahasiswaId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "NRP atau NIM mahasiswa",
          },
        ],
        responses: {
          200: {
            description: "Detail mahasiswa berhasil dimuat",
            content: jsonRef("#/components/schemas/StudentDetailResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          404: {
            description: "Mahasiswa tidak ditemukan",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat detail mahasiswa",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/predictions": {
      get: {
        tags: ["Academic"],
        summary: "Daftar seluruh riwayat prediksi",
        security: authSecurity,
        parameters: [
          {
            name: "angkatan",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan angkatan",
          },
        ],
        responses: {
          200: {
            description: "Daftar prediksi berhasil dimuat",
            content: jsonRef("#/components/schemas/PredictionListResponse"),
          },
          400: {
            description: "Angkatan tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat prediksi",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/v1/academic/prediksi": {
      get: {
        tags: ["Academic"],
        summary: "Alias dari endpoint daftar riwayat prediksi",
        description:
          "Mengembalikan data yang sama dengan `/api/v1/academic/predictions` untuk kompatibilitas penamaan endpoint lama.",
        security: authSecurity,
        parameters: [
          {
            name: "angkatan",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan angkatan",
          },
        ],
        responses: {
          200: {
            description: "Daftar prediksi berhasil dimuat",
            content: jsonRef("#/components/schemas/PredictionListResponse"),
          },
          400: {
            description: "Angkatan tidak valid",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          401: {
            description: "Unauthorized",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
          500: {
            description: "Gagal memuat prediksi",
            content: jsonRef("#/components/schemas/ErrorResponse"),
          },
        },
      },
    },
    "/api/predict": {
      post: {
        tags: ["Prediction Proxy"],
        summary: "Proxy request ke backend model prediksi",
        description:
          "Meneruskan payload apa adanya ke backend prediksi. URL backend berasal dari env `BACKEND_PREDICT_URL`, default ke `http://127.0.0.1:8000/predict`.",
        requestBody: {
          required: true,
          content: jsonRef("#/components/schemas/GenericObjectResponse"),
        },
        responses: {
          200: {
            description: "Response JSON sukses dari backend prediksi",
            content: jsonRef("#/components/schemas/GenericObjectResponse"),
          },
          500: {
            description: "Gagal menghubungi backend prediksi",
            content: jsonRef("#/components/schemas/ProxyErrorResponse"),
          },
          502: {
            description: "Backend mengembalikan response non-JSON",
            content: jsonRef("#/components/schemas/ProxyErrorResponse"),
          },
          default: {
            description: "Error yang diteruskan dari backend prediksi",
            content: jsonRef("#/components/schemas/ProxyErrorResponse"),
          },
        },
      },
    },
    "/api/v1/docs": {
      get: {
        tags: ["Documentation"],
        summary: "Swagger UI",
        responses: {
          200: {
            description: "Halaman HTML Swagger UI",
            content: {
              "text/html": {
                schema: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/docs/openapi.json": {
      get: {
        tags: ["Documentation"],
        summary: "OpenAPI JSON",
        responses: {
          200: {
            description: "Dokumen OpenAPI dalam format JSON",
            content: jsonRef("#/components/schemas/GenericObjectResponse"),
          },
        },
      },
    },
  },
};

export function getOpenApiSpec() {
  return openApiSpec;
}

export function getSwaggerHtml(specUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Predict API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      body {
        margin: 0;
        background: #f8fafc;
      }
      .topbar {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.SwaggerUIBundle({
          url: "${specUrl}",
          dom_id: "#swagger-ui",
          persistAuthorization: true,
        });
      };
    </script>
  </body>
</html>`;
}
