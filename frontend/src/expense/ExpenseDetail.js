import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom'
import ExpenseService from './ExpenseService';
import axios from 'axios';
import {Table} from 'react-bootstrap';

const expenseService = new ExpenseService();

class ExpenseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expense: [],
            expenseEntries: [],
            loading: false
        };
    }

    handleDeleteExpense() {
        expenseService.deleteExpense(this.props.match.params.id).then(() => {
            alert("Expense deleted");
            this.props.history.push('');
        }).catch(() => {
            alert("Something went wrong");
        })
    }

    componentDidMount() {
        expenseService.getExpenseDetail().then(result=> {
            this.setState({
                name: result['name'],
                bill_amount: result['bill_amount'],
                date: result['date'],
                description: result['notes'],
                paid_by: result['paid_by_username'],
                expenseEntries: result['expenseentry_set'],
                anon_link: result['anon_link'],
                loading: true
            });
        }). catch ( () => {
            alert("Expense not found");
            this.props.history.push('/');
        });
    }

    copyToClipBoard() {
        var copyText = document.querySelector("#anon_link");
        copyText.select();
        document.execCommand("copy");
    }

    render() {
        if (this.state.loading) {
            return (
                <Fragment>
                    <title>MoneySplit | {this.state.name}</title>
                    <div class="container">
                    <h1>Expense for {this.state.name}</h1>
                            <p>Bill Amount: ${ this.state.bill_amount}</p>
                          <input readOnly className="w-50" type="text" id="anon_link"
                               value={`localhost:3000/expense/pay/${this.state.anon_link}`}/>
                            <button onClick={this.copyToClipBoard} id="copy">Copy Payment Link</button>

                            <p>Date Created: { this.state.date}</p>
                            <p>Description: {this.state.description}</p>
                            <p>Paid By: {this.state.paid_by}</p>
                            <Table>
                            <tr>
                                <th>Name: </th>
                                <th>Owing Amount: </th>
                            </tr>
                            {this.state.expenseEntries.map(exp => (
                                <tr>
                                    <td>{exp.user.username}</td>
                                    <td>{exp.amount}</td>
                                </tr>
                            ))}
                            </Table>
                        <div><Link to={this.props.location.pathname + "/pay/"}>Make Payment</Link></div>
                        <div><Link to={this.props.location.pathname + "/delete/"} onClick={this.handleDeleteExpense}>Delete Expense</Link></div>
                        <div><Link to="/">Back to dashboard</Link></div>
                    </div>
                </Fragment>
            )
        }
        else {
            return (
                <Fragment>
                <title>MoneySplit | Expense not found</title>
                <div class="container"></div>
                </Fragment>
            )
        }
    }
}


export default ExpenseDetail;