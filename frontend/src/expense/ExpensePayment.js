import React, { Component, Fragment } from 'react';
import ExpenseService from './ExpenseService';

const expenseService = new ExpenseService();

class ExpensePayment extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            name: "",
            paid_by_username: "",
            loading: false
        };
        this.render = this.render.bind(this);
    }

    handleSubmit(event) {
        const {match : {params}} = this.props;
        expenseService.expensePayment(
            {
                "name": this.state.name,
                "amount": this.refs.paymentAmount.value
            }, this.props.match.params.id).then((result) => {
                alert("Expense payment successful");
                this.props.history.push('');
            }).catch( () => {
                alert("Not a valid amount");
            })
        event.preventDefault();
    }

    componentDidMount() {
        expenseService.getExpenseDetail().then(result=> {
            console.log(result)
            this.setState({
                name: result['name'],
                paid_by_username: result['paid_by_username'],
                amount: result['amount'],
                loading: true
            });
        }).catch ( () => {
            alert("Expense not found");
            this.props.history.push('/');
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <Fragment>
                <title>MoneySplit | Expense Payment</title>
                <div class = "container">
                <form onSubmit={this.handleSubmit}>
                        <div className="form-expense">
                            <h1 ref='name'>Payment for: {this.state.name}</h1>
                            <p>Payment to: {this.state.paid_by_username}</p>
                            <p>Amount owed: {this.state.amount}</p>
                            <label>Amount*</label>
                            <input className="form-control" type="number" min='0.01' step='0.01' max={this.state.amount} ref='paymentAmount'/>
        
                            <br />
        
                            <input className="btn btn-primary" type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
                </Fragment>
            )
        }
        else {
            return (
                <Fragment>
                <title>MoneySplit | Expense not found</title>
                <div class = "container"></div>
                </Fragment>
            )
        }
    }
}

export default ExpensePayment;
