// import cloudinary from "@/utils/cloudinary";
// import formidable from "formidable";
// import fs from "fs";

// export const config = {
//   api: { bodyParser: false },
// };

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) return res.status(500).json({ error: err.message });

//       try {
//         const file = files.image;
//         const result = await cloudinary.uploader.upload(file.filepath, {
//           folder: "my_app_images", // папка на Cloudinary
//         });
//         fs.unlinkSync(file.filepath); // удаляем временный файл
//         res.status(200).json({ url: result.secure_url });
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });
//   } else {
//     res.status(405).json({ error: "Метод не разрешён" });
//   }
// }

import { NextRequest } from "next/server";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "../../../utils/cloudinary";

// App Router: отключаем парсер тела
export const runtime = "nodejs"; 

export async function POST(req) {
  return new Promise((resolve) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(
          new Response(JSON.stringify({ error: err.message }), { status: 500 })
        );
        return;
      }

      try {
        const file = files.image;
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "my_app_images",
        });

        fs.unlinkSync(file.filepath); // удаляем временный файл

        resolve(
          new Response(JSON.stringify({ url: result.secure_url }), {
            status: 200,
          })
        );
      } catch (error) {
        resolve(
          new Response(JSON.stringify({ error: error.message }), { status: 500 })
        );
      }
    });
  });
}



