import * as fs from "fs/promises";

const encodeImage = async (input: string | File | Blob): Promise<string> => {
  try {
    if (typeof input === 'string') {
      // Handle file path
      const imageBuffer = await fs.readFile(input);
      return Buffer.from(imageBuffer).toString('base64');
    } else {
      // Handle File/Blob object
      const arrayBuffer = await input.arrayBuffer();
      return Buffer.from(arrayBuffer).toString('base64');
    }
  } catch (error) {
    throw new Error(`Error encoding image: ${error.message}`);
  }
};

export default encodeImage;
