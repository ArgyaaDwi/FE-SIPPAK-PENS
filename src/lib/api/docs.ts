const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Predict API",
    version: "1.0.0",
    description:
      "Dokumentasi API untuk autentikasi, prediksi IPK, dan data akademik.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Current environment",
    },
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
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Unauthorized" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "kaprodi@kampus.ac.id" },
          password: { type: "string", format: "password", example: "rahasia123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login berhasil" },
          data: {
            type: "object",
            properties: {
              token: { type: "string", example: "jwt-token" },
              role: { type: "string", example: "KAPRODI" },
            },
          },
        },
      },
      MahasiswaItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "3122600001" },
          nama: { type: "string", example: "Budi Santoso" },
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
      PredictionProbability: {
        type: "object",
        properties: {
          rendah: { type: "number", format: "float", example: 0.1 },
          sedang: { type: "number", format: "float", example: 0.2 },
          tinggi: { type: "number", format: "float", example: 0.7 },
        },
      },
      MahasiswaDetailResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
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
              latestPrediction: {
                type: "object",
                nullable: true,
                properties: {
                  id: { type: "string", example: "cmd123" },
                  output: { type: "string", example: "Tinggi" },
                  status: { type: "string", example: "tinggi" },
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
              predictions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "cmd123" },
                    output: { type: "string", example: "Tinggi" },
                    status: { type: "string", example: "tinggi" },
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
              },
            },
          },
        },
      },
      PredictionListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          filters: {
            type: "object",
            properties: {
              angkatan: { type: "integer", nullable: true, example: 2022 },
            },
          },
          total: { type: "integer", example: 10 },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", example: "cmd123" },
                output: { type: "string", example: "Tinggi" },
                status: { type: "string", example: "tinggi" },
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
          },
        },
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "400": {
            description: "Email/password kosong",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: {
          "200": {
            description: "Logout berhasil",
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Cek sesi login",
        security: [{ sessionCookie: [] }, { bearerAuth: [] }],
        responses: {
          "200": { description: "Session valid" },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/mahasiswa": {
      get: {
        tags: ["Mahasiswa"],
        summary: "Ambil daftar mahasiswa untuk dropdown",
        security: [{ sessionCookie: [] }, { bearerAuth: [] }],
        responses: {
          "200": {
            description: "Daftar mahasiswa",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/MahasiswaItem" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/predict": {
      post: {
        tags: ["Prediksi"],
        summary: "Simpan hasil prediksi ke database",
        security: [{ sessionCookie: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PredictRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Prediksi berhasil disimpan",
          },
          "400": {
            description: "Mahasiswa wajib dipilih",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/academic/mahasiswa": {
      get: {
        tags: ["Academic"],
        summary: "Daftar mahasiswa akademik",
        security: [{ sessionCookie: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "kelas_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan kelas",
          },
        ],
        responses: {
          "200": { description: "Daftar mahasiswa berhasil dimuat" },
        },
      },
    },
    "/academic/mahasiswa/{mahasiswaId}": {
      get: {
        tags: ["Academic"],
        summary: "Detail mahasiswa dan riwayat prediksi",
        security: [{ sessionCookie: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: "mahasiswaId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "NRP/NIM mahasiswa",
          },
        ],
        responses: {
          "200": {
            description: "Detail mahasiswa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MahasiswaDetailResponse",
                },
              },
            },
          },
          "404": {
            description: "Mahasiswa tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/academic/prediksi": {
      get: {
        tags: ["Academic"],
        summary: "Daftar seluruh riwayat prediksi",
        security: [{ sessionCookie: [] }, { bearerAuth: [] }],
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
          "200": {
            description: "Daftar prediksi",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PredictionListResponse",
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

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
