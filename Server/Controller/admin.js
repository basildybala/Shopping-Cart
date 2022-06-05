const Product = require("../Models/Product");
const User = require("../Models/User");
const Order = require("../Models/Order");
const slugify = require("slugify");


exports.homePage = async (req, res) => {
  try {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const thisMonth = new Date(date.setMonth(date.getMonth() - 1));

    let order = await Order.count();
    //Users JOIN Count
    let lastMonthCount = await User.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
    ]);
    // let MonthCount = await User.aggregate([
    //     { $match: { createdAt: { $gte: thisMonth } } },
    // ]);
    let userLcount = lastMonthCount.length;
    let totalCountUsers = await User.count();
    let orders = await Order.find().sort({ _id: -1 });
    let totalSales = orders.length;
    if (order > 0) {
      //Total Sales Amount Calculation

      const income = await Order.aggregate([
        { $project: { sales: "$totalAmount" } },
        { $group: { _id: null, total: { $sum: "$sales" } } },
      ]);
      let totalIncome = income[0].total;

      res.render("admin/admin", {
        totalCountUsers,
        userLcount,
        totalIncome,
        totalSales,
        orders,
      });
    } else {
      let totalIncome = 0;
      res.render("admin/admin", {totalCountUsers,userLcount,totalIncome,totalSales,orders,});
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};

//PRODUCTS

exports.allProducts = async (req, res) => {
  try {
    let products = await Product.find();
    res.render("admin/all-product", { products });
  } catch (error) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
//ADD PRODUCTS

exports.addProduct = async (req, res) => {
  try {
    res.render("admin/add-product");
  } catch (error) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
exports.addProductPost = async (req, res) => {
  try {
    const {
      title,
      price,
      desc,
      category,
      qty,
      instock,
      categories,
      size,
      color,
      listingprice,
    } = req.body;
    if (req.files.length > 0) {
      let path = "";
      req.files.forEach(function (files, index, arr) {
        path = path + files.path + ",";
      });
      path = path.substring(0, path.lastIndexOf(","));
      var productPictures = path.split(",");
    }

    let discount = ((listingprice - price) / listingprice) * 100;
    let Discount = Math.round(discount);

    const product = new Product({
      title,
      slug: slugify(title),
      price,
      desc,
      category,
      qty,
      instock,
      productPictures,
      discount: Discount,
      categories,
      color,
      size,
      listingprice,
    });

    product
      .save()
      .then((r) => {
        res.send(r);
      })
      .catch((e) => {
        console.log(e);
      });

    res.redirect("/admin/all-products");
  } catch (error) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};

//EDIT PRODUCTS

exports.editProduct = async (req, res) => {
  try {
    let proId = req.params.id;
    let product = await Product.findById(proId);
    res.render("admin/edit-product", { product });
  } catch (error) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
exports.editProductPost = async (req, res) => {
  try {
    let proId = req.params.id;

    let firstBody = req.body;
    let Discount =
      ((req.body.listingprice - req.body.price) / req.body.listingprice) * 100;
    let discount = Math.round(Discount);
    let body = { ...firstBody, discount };

    if (req.files.length > 0) {
      let Pictures = req.body.productPictures;
      let path = Pictures + ",";
      req.files.forEach(function (files, index, arr) {
        path = path + files.path + ",";
      });
      path = path.substring(0, path.lastIndexOf(","));
      let productPictures = path.split(",");
      //  let body=req.body

      let finalBody = { ...body, productPictures };
      console.log(finalBody);
      const updateProdoct = await Product.findByIdAndUpdate(
        proId,
        {
          $set: finalBody,
        },
        { new: true }
      );
      res.status(200).redirect("/admin/all-products");
    } else {
      const updateProdoct = await Product.findByIdAndUpdate(
        proId,
        {
          $set: body,
        },
        { new: true }
      );
      res.status(200).redirect("/admin/all-products");
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};

//DELETE PRODUCTS

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/admin/all-products");
  } catch (err) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
//USERS ORDER STATUS CHANGE

exports.orderStatusChange = async (req, res) => {
  try {
    let orderId = req.body.orderId;
    let userStatus = req.body.status;
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        status: userStatus,
      },
    });
    res.status(200).redirect("/admin");
  } catch (err) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
//USERS ORDER DETAILS

exports.orderDetails = async (req, res) => {
  try {
    let orderId = req.params.id;

    let order = await Order.findById(orderId);
    console.log(order);
    res.status(200).render("admin/order-details", { order });
  } catch (err) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
//USERS ORDER DETAILS

exports.orderDelete = async (req, res) => {
  try {
    let orderId = req.params.id;

    let order = await Order.findByIdAndRemove(orderId);

    res.status(200).redirect("/admin");
  } catch (err) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
