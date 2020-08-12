import React, { Fragment } from "react";
import ExpenseService from "../expense/ExpenseService";
import Alert from "../user/Alert";

const expenseService = new ExpenseService()

export default class PayAnon extends React.Component {
    handleUserSelect = (e) => {
        const selection = e.target.value
        this.setState(
            {"selected": selection}
        )
        this.handleSubmit.bind(this)
    };


    constructor(props) {
        super(props);
        this.state =
            {
                "status": "",
                "members": [],
                "amounts": {},
                "selected": "",
                "errors": {
                    "selection": "",
                    "payment_amount": ""
                },
                "payment_success": false
            }

    }

    componentDidMount() {
        expenseService.getPayAnonLinkDetails(this.props.match.params['id']).then(
            resp => {
                this.setState({
                    "status": resp['status'],
                    "members": resp['members'],
                    "amounts": resp['amounts'],
                    "name": resp['name']
                })
            }
        ).catch(e => {
            // console.log(e.response)
        })
    }


    handleSubmit = (e) => {
        //console.log(this.refs.payment_amount.value)
        const payment_amount = this.refs.payment_amount.value
        e.preventDefault()
        const [selection] = e.target
        let errors = {}
        if (selection.value === "defaultValue") {
            errors["selection"] = "Please select a user"
        }
        if (!payment_amount || payment_amount < 0 || payment_amount > this.state.amounts[this.state.selected]) {
            errors["payment_amount"] = "Not a valid amount"
        }
        this.setState(
            {
                errors: errors
            }
        )
        if (Object.keys(errors).length === 0) {
            expenseService.payAnonAonLink(this.state.selected, payment_amount, this.props.match.params['id']).then(e => {
                this.setState({
                    payment_success: true
                })
            }).catch(e => {
                // console.log(e)
            })
        }

    }

    render() {
        if (this.state.status !== "complete") {
            if (!this.state.payment_success) {
                return (
                    <Fragment>
                    <title>MoneySplit | Anonymous Payment</title>
                    <div className="container">
                        <h1>Make a payment</h1>
                        <h2>Expense: {this.state.name}</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>Select a person you want to pay as</label>
                                <select id="selection" onChange={this.handleUserSelect} className="form-control"
                                        defaultValue="defaultValue">
                                    <option disabled value="defaultValue"> -- select an option --</option>
                                    {this.state.members.map((member, index) => {
                                        return <option key={index}>{member}</option>
                                    })}
                                </select>
                                {this.state.errors.selection &&
                                (<Alert type="danger" des={this.state.errors.selection}/>)
                                }
                            </div>
                            <strong>Payment Due: {this.state.amounts[this.state.selected]}</strong>
                            <div className="form-group">
                                <label>Payment Amount</label>
                                <input id="payment_amount" ref="payment_amount" type="number" step="0.01" min="0.01"
                                       max={this.state.amounts[this.state.selected]}
                                       className="form-control"/>
                                {this.state.errors.payment_amount &&
                                (<Alert type="danger" des={this.state.errors.payment_amount}/>)
                                }

                            </div>
                            <button className="btn btn-primary">Pay</button>
                        </form>
                    </div>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                    <title>MoneySplit | Payment Successful</title>
                    <div className="container">
                        <h1>Payment received!</h1>
                    </div>
                    </Fragment>
                )
            }

        } else {
            return (
                <Fragment>
                <title>MoneySplit | Payment Complete</title>
                <div className="container">
                    <h1>This payment has been completed.</h1>
                </div>
                </Fragment>
            )
        }
    }
}