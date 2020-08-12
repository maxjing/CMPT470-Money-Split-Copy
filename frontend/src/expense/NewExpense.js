import React, {Component, Fragment} from 'react';
import ExpenseService from './ExpenseService';
import GroupService from "../group/GroupService";
import SplitByPercentage from "./splitByPercentage";
import './expense.css';
import SplitByAmount from "./splitByAmount";
import Alert from "../user/Alert";

const expenseService = new ExpenseService();
const groupService = new GroupService()

class NewExpense extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            "groupMembers": [],
            "groupName": "",
            "splitDistribution": [],
            "splitKey": "",
            "amount": 0,
            "splitModule": "",
            "expenseName": "",
            "date": "",
            "notes": "",
            "errorMessage": "",
            "errors": {
                "amount": "",
                "bill_amount": "",
                "date": "",
                "name": "",
                "message": ""
            }
        }
    }

    componentDidMount() {
        // grab group members
        groupService.getGroupDetail(this.props.match.params['id']).then(data => {
            this.setState({
                "groupMembers": data['users'],
                "groupName": data['name'],
                "groupId": data['id'],
                "splitModule": "",
            })
        }).catch(() => {
            alert("Group not found");
            this.props.history.push('');
        })
    }

    handleSplit = (e) => {
        const choice = e.target.value
        if (choice === "percentage") {
            module = <SplitByPercentage setState={p => this.setState(p)}
                                        groupMembers={this.state.groupMembers}/>
        } else if (choice === "amount") {
            module = <SplitByAmount amount={this.state.amount}
                                    setState={p => this.setState(p)}
                                    groupMembers={this.state.groupMembers}/>
        } else {
            module = ''

        }
        this.setState({
            "splitKey": choice,
            "splitModule": module
        })
    }

    handleCreate = (e) => {
        const form = e.target
        if (e.target.splitKey === "defaultValue") {
            this.setState({
                errors: {
                    message: "ah"
                }
            })
        }
        expenseService.newExpense(
            {
                "name": form.expenseName.value,
                "amount": form.amount.value,
                "bill_amount": form.amount.value,
                "date": form.date.value,
                "notes": form.notes.value,
                "splitKey": form.splitKey.value,
                "paid_by": form.paid_by.value,
                "group": this.state.groupId,
                "splitDistribution": this.state.splitDistribution
            }, this.props.match.params['id']).then(res => {
            alert("Expense created, redirecting now");
            this.props.history.push(`/expense/${res.data.id}`);
        }).catch((e) => {
            this.setState(
                {
                    "errors": e.response.data
                }
            )
        })
    }


    handleSubmit(event) {
        const {match: {params}} = this.props;
        this.handleCreate(event);
        event.preventDefault();
    }

    render() {
        return (
            <Fragment>
            <title>MoneySplit | New Expense</title>
            <div className="container">
                <h1>New Expense: {this.state.groupName}</h1>
                {this.state.errors.message && (
                    <Alert type="danger" des={this.state.errors.message} show={false}/>
                )}
                <div className="card">
                    <div className="card-body">
                        <div>You are splitting with</div>
                        {this.state.groupMembers.map((member, index) => {
                            return <li key={index}>{member['username']}</li>
                        })}
                    </div>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-expense">
                        <label>Expense Name*</label>
                        {this.state.errors.name &&
                        (<span className="text-danger">{this.state.errors.name[0]}</span>)
                        }
                        <input className="form-control" type="text" id='expenseName'/>
                        <br/>
                        <label>Amount*</label>
                        {this.state.errors.amount &&
                        (<span className="text-danger">{this.state.errors.amount[0]}</span>)
                        }
                        <input onInput={e => {
                            this.setState({
                                "amount": e.target.value
                            })
                        }} className="form-control" type="number" step='0.01' id='amount'/>
                        <br/>
                        <label htmlFor="paid_by" className="mr-1">Paid by*</label>
                        <select name="paid_by" id="paid_by" defaultValue="defaultValue">
                            <option disabled value="defaultValue"> -- select an option --</option>
                            {this.state.groupMembers.map((member, index) => {
                                return <option key={index} value={member['username']}>{member['username']}</option>
                            })}
                        </select>
                        <br/>
                        <label className="mr-1">Split*</label>
                        <select onChange={this.handleSplit} name="splitKey" id="splitKey" defaultValue="defaultValue">
                            <option disabled value="defaultValue"> -- select an option --</option>
                            <option value="equal">Equally =</option>
                            <option value="percentage">Percentage %</option>
                            <option value="amount">Amount $</option>
                        </select>
                        <div>{this.state.splitModule}</div>
                        <br/>
                        <label>Date*</label>
                        {this.state.errors.date &&
                        (<span className="text-danger">{this.state.errors.date[0]}</span>)
                        }
                        <input className="form-control" type="date" id='date'/>
                        <br/>
                        <label>Notes</label>
                        <textarea className="form-control" rows="4" cols="50" id='notes'/>
                        <br/>
                        <input className="btn btn-primary" type="submit" value="Submit"/>
                    </div>
                </form>
            </div>
            </Fragment>
        );
    }
}

export default NewExpense;
