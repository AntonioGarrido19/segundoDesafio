const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const infoFile = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(infoFile);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  async addProduct(obj) {
    try {
      const requiredProps = [
        "title",
        "description",
        "price",
        "thumbnail",
        "code",
        "stock",
      ];

      const isValidProduct = requiredProps.every(prop => obj.hasOwnProperty(prop));

      if (!isValidProduct) {
        throw new Error("Invalid product. Missing required properties.");
      }
      const productsPrev = await this.getProducts();

      const existingProduct = productsPrev.find(
        (product) => product.code === obj.code
      );
        if (existingProduct) {
          console.log (`Ya existe un producto con el código ${obj.code}.`)
          return
        }

      let id;
      if (!productsPrev.length) {
        id = 1;
      } else {
        id = productsPrev[productsPrev.length - 1].id + 1;
      }
      productsPrev.push({ ...obj, id });
      await fs.promises.writeFile(this.path, JSON.stringify(productsPrev));
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const productsPrev = await this.getProducts();
      const product = productsPrev.find((p) => p.id === id);
      if (!product) {
        return "Product not finded";
      }
      return product;
    } catch (error) {
      return error;
    }
  }

  async updateProduct(id, obj) {
    try {
      const productsPrev = await this.getProducts();
      const productIndex = productsPrev.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return "There is no product with such id";
      }
      const product = productsPrev[productIndex];
      productsPrev[productIndex] = { ...product, ...obj };
      await fs.promises.writeFile(this.path, JSON.stringify(productsPrev));
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      const productsPrev = await this.getProducts();
      const newProductsArray = productsPrev.filter((p) => p.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(newProductsArray));
    } catch (error) {
      return error;
    }
  }
}

const product1 = {
  title: "Cup",
  description: "Blue",
  price: 200,
  thumbnail: "none",
  code: "aadd88",
  stock: 5,
};

const product2 = {
  title: "Cup",
  description: "Blue",
  price: 200,
  thumbnail: "none",
  code: "aadd88",
  stock: 5,
};

const product3 = {
  title: "Mouse",
  description: "Red",
  price: 200,
  thumbnail: "none",
  code: "aadd88",
  stock: 5,
};

const product4 = {
  title: "Mouse",
  description: "Red",
  price: 200,
  thumbnail: "none",
  code: "aadd88",
  stock: 5,
};

const product5 = {
  title: "Mouse",
  description: "Red",
  price: 200,
  thumbnail: "none",
  code: "aadd213",
  stock: 5,
};

const product6 = {
  title: "Mouse",
  price: 200,
  thumbnail: "none",
  code: "aadd2113",
  stock: 5,
};

async function test() {
  const manager1 = new ProductManager("Product.json");
  await manager1.addProduct(product6)
  // await manager1.updateProduct(2, {title: 'Mouse', price:300})
  // await manager1.deleteProduct(2)
  // const product = await manager1.getProductById(3);
  const products = await manager1.getProducts();
  // console.log(products);
  console.log(products);

}

test();
