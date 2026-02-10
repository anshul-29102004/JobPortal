import bcrypt from "bcryptjs";

const generateHash = async () => {
  const hash = await bcrypt.hash("qwerty123", 10);
  console.log(hash);
};

generateHash();
