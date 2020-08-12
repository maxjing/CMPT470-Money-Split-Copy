import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom'
import ExpenseService from './ExpenseService';
import axios from 'axios';
import {Table} from 'react-bootstrap'

const expenseService = new ExpenseService();

class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            payments: []
        };
        this.render = this.render.bind(this);
    }

    componentDidMount() {
        expenseService.getPaymentHistory().then(result=> {
            this.setState({payments: result, isLoaded: true});
        });
    }

    render() {
        const {isLoaded, payments} = this.state;

        if (payments.length == 0) {
            return (
                <Fragment>
                <title>MoneySplit | Your Payments</title>
                <div className="container">
                    <h1>You have not made any payments.</h1>
                </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                <title>MoneySplit | Your Payments</title>
                <div className="container">
                    <div className="payments"><h1>Here is a list of all payments you've made:</h1>
                    <Table>
                        <tr>
                            <th>Name: </th>
                            <th>Amount: </th>
                            <th>Date: </th>
                        </tr>
                        {payments.map(payment => [
                            <tr>
                                <td>
                                <Link to={"/expense/" + payment.groupExpense}>{payment.name}</Link>
                                </td>
                                <td>
                                    {payment.amount}
                                </td>
                                <td>
                                    {payment.date}
                                </td>
                            </tr>
                        ])}
                    </Table>
                    </div>
                </div>
                </Fragment>
            )
        }
    }
}


export default Payments;