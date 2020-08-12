import React, {Component, Fragment} from 'react';
import GroupService from './GroupService';
import {Link} from 'react-router-dom';
import {Table} from 'react-bootstrap';

const groupService = new GroupService();

class GroupDetail extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.handleAddFriend = this.handleAddFriend.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.state = {
            "group_members": [],
            "group_expenses": [],
            "group_name": "",
            loading: false
        }
    }

    handleAddFriend(event) {
        event.preventDefault();
        groupService.addFriend(this.props.match.params['id'],
            {
                "email": this.refs.username.value,
                "group_id": this.props.match.params['id']
            }).then(() => {
            alert("Friend Added!");
            window.location.reload();
        }).catch(() => {
            alert("There was an error! Please the input email is correct.");
        })
    }

    handleDeleteGroup() {
        groupService.deleteGroup(this.props.match.params['id']).then(() => {
            alert("Group deleted");
            this.props.history.push('');
        }).catch(() => {
            alert("Something went wrong");
        })
    }

    componentDidMount() {
        groupService.getGroupDetail(this.props.match.params['id']).then(result => {
            this.setState({
                "group_members": result['users'],
                "group_name": result['name'],
                "group_expenses": result['expense_set'],
                loading: true
            })
        }). catch(() => {
            alert("Group not found");
            this.props.history.push('/');
        })
    }

    render() {
        if (!this.state.loading) {
            return (
                <Fragment>
                    <title>MoneySplit | Group not found</title>
                    <div className="containers"></div>
                </Fragment>
            )
        }
        else {
            return (
                <div className="container">
                    <h1>Group Name: {this.state.group_name}</h1>
                    <h2>Members:</h2>
                    {
                        this.state.group_members.map(member =>
                            <p>{member.username}</p>)
                    }
    
                    <h2>Expenses:</h2>
                    {
                        <Table>
                            <tr>
                                <th>Name: </th>
                                <th>Amount: </th>
                            </tr>
                            {this.state.group_expenses.map(group_expense =>
                                <tr>
                                    <td><Link to={`/expense/${group_expense.id}`}>{group_expense.name}</Link></td>
                                    <td>${group_expense.amount}</td>
                                </tr>
                        )}
                        </Table>
                    }
                    <div><Link to={"/expense/" + this.props.match.params['id'] + "/new"}>Add New Expense</Link></div>
                    <br/>
                    <h3> Add Friend Here:</h3>
                    <form onSubmit={this.handleAddFriend}>
                        <div className="form-group">
                            <label>Enter Friend Email: </label>
                            <input className="form-control" type="email" ref='username'/>
                            <br/>
                            <input className="btn btn-primary" type="submit" value="Submit"/>
                        </div>
                    </form>
                    <div><Link to={"/group/" + this.props.match.params['id'] + "/delete"} onClick={this.handleDeleteGroup}>Delete Group</Link></div>
                </div>
            )
        }
    }
}

export default GroupDetail;

