import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./Home.css";
import {
  checkout,
  manipulateQuantity,
  deleteFromCart,
} from "../redux/actions/Cart";
import { getProducts } from "../redux/actions/Product";
import Navbar from "../layout/Navbar";
const url = process.env.REACT_APP_URL;
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cashier: localStorage.getItem("user-id"),
      tPrice: 0,
      change: 0,
      pay: "-",
      isDisabled: true,
    };
  }
  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.props.dispatch(getProducts({}));
  }
  payment = (e) => {
    this.setState({
      pay: e.target.value,
    });
    if (e.target.value >= this.state.tPrice) {
      this.setState({
        isDisabled: false,
        change: e.target.value - this.state.tPrice,
      });
    } else {
      this.setState({ isDisabled: true, change: 0 });
    }
  };
  changeQuantity = (data, e) => {
    if (e.target.value <= data.stock) {
      data.quantity = parseInt(e.target.value);
      this.props.dispatch(manipulateQuantity(data));
    }
  };
  addQuantity = (data) => {
    if (data.quantity < data.stock) {
      data.quantity += 1;
      this.props.dispatch(manipulateQuantity(data));
    }
  };
  reduceQuantity = (data) => {
    if (data.quantity > 1) {
      data.quantity -= 1;
      this.props.dispatch(manipulateQuantity(data));
    }
  };
  deleteFromCart = (id) => {
    this.props.dispatch(deleteFromCart(id));
  };
  countTotal = () => {
    var total = 0;
    this.props.productsInCart.forEach((e) => {
      total += e.price * e.quantity;
    });
    this.setState({
      tPrice: total,
    });
  };
  purchaseHandler = () => {
    const data = {
      products: this.props.productsInCart,
    };
    this.props.dispatch(checkout(data));
    var printcontent = document.getElementById("purchase-detail").innerHTML;
    window.frames["print_frame"].document.body.innerHTML =
      `<style>*{font-size:8px;} button{display:none}</style>` + printcontent;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };

  componentDidUpdate() {
    console.log("reject", this.props.reject);
    if (this.props.reject) {
      localStorage.clear();
      this.props.history.push("/login");
    }
  }

  render() {
    const CheckoutButton = () => {
      if (this.state.isDisabled === true) {
        return (
          <button
            disabled={this.state.isDisabled}
            className="btn btn-info mt-3"
            style={{ cursor: "not-allowed" }}
          >
            Checkout
          </button>
        );
      } else {
        return (
          <button
            onClick={this.purchaseHandler}
            className="btn btn-info mt-3"
            data-dismiss="modal"
          >
            Checkout
          </button>
        );
      }
    };
    const PriceParsed = (data) => {
      return (
        <span>
          {data.data
            .toString()
            .split("")
            .reverse()
            .join("")
            .match(/\d{1,3}/g)
            .join(".")
            .split("")
            .reverse()
            .join("")}
        </span>
      );
    };
    const ViewCart = () => {
      if (this.props.productsInCart.length < 1) {
        return (
          <div className="col-6 mt-2">
            <h3 className="mt-3">Ups... There is no product to buy</h3>
          </div>
        );
      } else {
        return (
          <div className="col-6" style={{ paddingBottom: "40px" }}>
            {this.props.productsInCart.map((cartItem) => (
              <li
                className="list-group-item"
                style={{ padding: "0", border: "none" }}
                key={cartItem.productId}
              >
                <div
                  className="media"
                  style={{ textAlign: "left", marginBottom: -10 }}
                >
                  <img
                    style={{
                      width: "64px",
                      height: "60px",
                      borderRadius: "8px",
                    }}
                    src={url + cartItem.image}
                    className="mr-3"
                    alt="..."
                  />

                  <div className="media-body">
                    <h6 className="mt-0 cartName">{cartItem.name}</h6>
                    <span style={{ position: "relative", top: "-6px" }}>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => this.reduceQuantity(cartItem)}
                      >
                        -
                      </button>

                      <input
                        onChange={(value) =>
                          this.changeQuantity(cartItem, value)
                        }
                        value={cartItem.quantity}
                        style={{
                          width: 35,
                          textAlign: "center",
                          alignSelf: "center",
                          border: "none",
                          outline: "none",
                        }}
                      ></input>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => this.addQuantity(cartItem)}
                      >
                        +
                      </button>
                      <span
                        id={cartItem.price}
                        style={{ float: "right" }}
                        className="cartPrice"
                      >
                        Rp.{" "}
                        <PriceParsed
                          data={cartItem.price * cartItem.quantity}
                        />
                      </span>
                      <i
                        className="material-icons medium"
                        style={{
                          position: "relative",
                          left: "90px",
                          cursor: "pointer",
                          color: "grey",
                        }}
                        onClick={() => this.deleteFromCart(cartItem.productId)}
                      >
                        delete
                      </i>
                    </span>
                  </div>
                </div>
                <hr />
              </li>
            ))}
            <button
              data-toggle="modal"
              data-target="#purchase-detail"
              className="btn btn-info"
              onClick={this.countTotal}
            >
              Payment
            </button>
          </div>
        );
      }
    };
    return (
      <Fragment>
        <Navbar activeNav="cart" />
        <div className="container">
          <div className="row justify-content-md-center mt-4">
            <ViewCart />
            <div className="col-3"></div>
          </div>
          <div className="col-4 cool"></div>
        </div>

        <div
          className="modal fade"
          id="purchase-detail"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  IrsandiCafe
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <p>Cashier ID: {this.state.cashier}</p>
                  {this.props.productsInCart.map((product, index) => (
                    <div className="row" key={index}>
                      <div className="col-md-4">{product.name}</div>
                      <div className="col-md-4">
                        Rp. <PriceParsed data={product.price} />
                      </div>
                      <div className="col-md-2">x{product.quantity}</div>
                    </div>
                  ))}
                  <p className="mt-4">
                    Total : Rp. <PriceParsed data={this.state.tPrice} />
                  </p>
                  <div className="mt-1">
                    Payment: Rp.{" "}
                    <input
                      autoFocus={true}
                      type="number"
                      style={{
                        border: "none",
                        borderBottom: "1px solid #5bc0de",
                        outline: "none",
                      }}
                      onChange={this.payment}
                      value={this.state.pay}
                    ></input>
                  </div>
                  <div className="mt-2">
                    Change: Rp. <PriceParsed data={this.state.change} />
                  </div>
                  <CheckoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
        <iframe
          title="receipt"
          id="printing-frame"
          name="print_frame"
          src="about:blank"
          style={{ display: "none" }}
        ></iframe>
      </Fragment>
    );
  }
}

const mapCart = (state) => {
  return {
    productsInCart: state.cart.cart,
    reject: state.products.reject,
  };
};

export default connect(mapCart)(Cart);
