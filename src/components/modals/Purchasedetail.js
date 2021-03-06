import React, { Component } from "react";
import { connect } from "react-redux";
import { getDetailHistory, resetHistory } from "../redux/actions/History";
import Barcode from "react-barcode";

class Purchasedetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tPrice: 0,
      mount: this.props.mount
    };
  }

  reset = () => {
    this.setState({
      tPrice: 0,
      mount: true
    });
    this.props.dispatch(resetHistory());
  };

  componentWillReceiveProps({ id }) {
    this.getData(id);
  }

  getData(id) {
    if (this.state.mount) {
      this.props.dispatch(getDetailHistory(id));
      if (this.props.detailHistory[0]) {
        let a = 0;
        this.props.detailHistory.forEach(e => {
          a += e.Price;
        });
        this.setState({ tPrice: a, mount: false });
      }
    }
  }

  render() {
    return (
      <div
        data-backdrop="static"
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
                onClick={() => this.reset()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {this.state.tPrice > 0 ? (
              <div className="modal-body">
                <p>Invoice:</p>
                <div style={{ marginBottom: 15, marginTop: -15 }}>
                  <Barcode
                    value={this.props.id.toString()}
                    width={1}
                    height={30}
                    fontSize={18}
                  />
                </div>
                {this.props.detailHistory.map((e, index) => (
                  <div className="row" key={index}>
                    <div className="col-md-4">{e.name}</div>
                    <div className="col-md-4">{e.Qty}</div>
                    <div className="col-md-4">Rp. {e.Price}</div>
                  </div>
                ))}
                <hr />
                <div className="row">
                  <div className="col-md-4">Total : </div>
                  <div className="col-md-4"></div>
                  <div className="col-md-4">Rp. {this.state.tPrice}</div>
                </div>
                <button
                  className="btn btn-info mt-3"
                  data-dismiss="modal"
                  onClick={this.reset}
                >
                  OK
                </button>
              </div>
            ) : (
              <span></span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDetailHistory = state => {
  return {
    detailHistory: state.histories.detailHistory
  };
};

export default connect(mapDetailHistory)(Purchasedetail);
