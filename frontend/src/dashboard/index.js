import React, { Fragment } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import CreateExpenseModal from "./createExpenseModal";
import ExpenseService from "../expense/ExpenseService";
const expenseService = new ExpenseService();

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
      owing: 0,
      owed: 0,
      expenses_owed: [],
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      expenseService.getUserOwingExpense().then((res) => {
        this.setState({
          owing: parseFloat(res["amount"]),
          expenses: res["expenses"],
        });
      });
      expenseService
        .getUserOwedExpense()
        .then((res) => {
          this.setState({
            owed: parseFloat(res["amount"]),
            expenses_owed: res["expenses"],
          });
        })
        .catch((e) => {
          // console.log(e.response)
        });
    }
  }

  render() {
    return (
      <Fragment>
        <title>MoneySplit | Dashboard</title>
        <div className="container">
          <p>hahahah</p>
          <div className="card">
            <div className="card-body">
              <h1>
                Total Balance $
                {this.state.owed &&
                  (this.state.owed - this.state.owing).toFixed(2)}{" "}
                CADi
              </h1>
              <div className="d-flex mb-1">
                <div className="dot-green mr-1" />
                <div>
                  You are owed: ${this.state.owed && this.state.owed.toFixed(2)}
                </div>
              </div>
              <div className="d-flex mb-1">
                <div className="dot-red mr-1" />
                <div>
                  You owe: ${this.state.owed && this.state.owing.toFixed(2)}
                </div>
              </div>
              <div className="mt-3 d-flex">
                <CreateExpenseModal {...this.props} style={{ marginRight: 2 }}>
                  Create an expense
                </CreateExpenseModal>

                {/* <Link to="/group/create" className="btn btn-warning">Make a group</Link> */}
              </div>
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-body">
              <h2>YOU OWE</h2>
              <span>Summary of the amount you owe per expense</span>
              <ul className="owed-list">
                {this.state.expenses &&
                  this.state.expenses.map((d, index) => {
                    return (
                      <Link
                        key={index}
                        className="plain-link"
                        to={"/expense/" + d["groupExpense"]}
                      >
                        <li className="entry negative-entry">
                          <div className="d-flex">
                            <span className="name mr-auto">
                              {d["paid_by_username"]}
                            </span>
                            <span>{d["date"]}</span>
                          </div>
                          <div>
                            you owe <b>${d["amount"]}</b>
                          </div>
                        </li>
                      </Link>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-body">
              <h2>YOU ARE OWED</h2>{" "}
              <span>Summary of the amounts each person owing you</span>
              <ul className="owed-list">
                {this.state.expenses_owed &&
                  Object.keys(this.state.expenses_owed).map((key, index) => {
                    return (
                      <li className="entry negative-entry">
                        <span className="name">{key}</span>
                        <div>
                          owes you{" "}
                          <b>
                            $
                            {this.state.expenses_owed &&
                              parseFloat(this.state.expenses_owed[key]).toFixed(
                                2
                              )}
                          </b>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
