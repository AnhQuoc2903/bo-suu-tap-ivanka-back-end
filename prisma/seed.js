require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const images = [
  {
    id: 1,
    title: "Mây trên đỉnh núi",
    label: "MOUNTAINS",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
    description:
      "Những đỉnh núi ẩn hiện giữa biển mây, ghi lại cảm giác bình yên và rộng lớn của thiên nhiên.",
    date: "12/03/2025",
    location: "Vùng núi cao",
    tags: ["núi", "mây", "thiên nhiên"],
  },
  {
    id: 2,
    title: "Khoảng lặng mùa đông",
    label: "SNOW",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1000&q=85",
    description: "Một nhành cây giữa nền tuyết trắng, giản dị và tĩnh lặng.",
    date: "08/01/2025",
    location: "Miền tuyết trắng",
    tags: ["tuyết", "mùa đông"],
  },
  {
    id: 3,
    title: "Sắc xanh bên mặt hồ",
    label: "BLUE",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85",
    description:
      "Màu xanh dịu nhẹ của mặt nước và bầu trời trong một ngày nhiều mây.",
    date: "21/06/2025",
    location: "Bờ hồ",
    tags: ["hồ", "xanh", "mặt nước"],
  },
  {
    id: 4,
    title: "Hòn đảo nhỏ",
    label: "ISLAND",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85",
    description:
      "Một góc thiên nhiên yên bình, nơi đường chân trời kéo dài vô tận.",
    date: "02/08/2025",
    location: "Ngoài khơi",
    tags: ["đảo", "biển"],
  },
  {
    id: 5,
    title: "Con đường ra mặt nước",
    label: "WATER",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85",
    description: "Mặt nước và đường chân trời tạo nên khung cảnh tối giản.",
    date: "17/09/2025",
    location: "Bờ biển",
    tags: ["nước", "biển"],
  },
  {
    id: 6,
    title: "Một mình giữa đại dương",
    label: "OCEAN",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
    description: "Một khung cảnh biển rộng mở, nhẹ nhàng và tự do.",
    date: "30/09/2025",
    location: "Bờ biển",
    tags: ["đại dương", "biển"],
  },
  {
    id: 7,
    title: "Người bạn nhỏ",
    label: "DOG",
    category: "animals",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85",
    description: "Ánh mắt tò mò và đáng yêu của một người bạn bốn chân.",
    date: "05/02/2025",
    location: "Ở nhà",
    tags: ["chó", "thú cưng"],
  },
  {
    id: 8,
    title: "Mèo trong nắng",
    label: "CAT",
    category: "animals",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=85",
    description: "Một khoảnh khắc bình yên của chú mèo dưới ánh sáng tự nhiên.",
    date: "14/04/2025",
    location: "Góc cửa sổ",
    tags: ["mèo", "thú cưng"],
  },
  {
    id: 9,
    title: "Cánh chim tự do",
    label: "WILDLIFE",
    category: "animals",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1000&q=85",
    description:
      "Một khoảnh khắc nhỏ nhưng đầy sức sống của thế giới động vật.",
    date: "19/05/2025",
    location: "Thiên nhiên",
    tags: ["chim", "động vật hoang dã"],
  },
  {
    id: 10,
    title: "Ánh nhìn hoang dã",
    label: "WILD",
    category: "animals",
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=85",
    description: "Một chân dung động vật với ánh nhìn mạnh mẽ.",
    date: "11/11/2025",
    location: "Khu bảo tồn",
    tags: ["động vật", "hoang dã"],
  },
];

function parseDate(value) {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

async function main() {
  for (const item of images) {
    const { id, date, ...rest } = item;

    await prisma.image.upsert({
      where: { id },
      create: {
        id,
        ...rest,
        date: parseDate(date),
      },
      update: {
        ...rest,
        date: parseDate(date),
      },
    });
  }

  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('images', 'id'),
      COALESCE((SELECT MAX(id) FROM images), 1),
      EXISTS(SELECT 1 FROM images)
    )
  `;

  console.log(`Import thành công ${images.length} ảnh.`);
}

main()
  .catch((error) => {
    console.error("Import dữ liệu thất bại:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
