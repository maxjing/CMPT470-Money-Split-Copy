import React, { Component, Fragment } from 'react';
import GroupService from './GroupService';

const groupService = new GroupService();

class GroupCreate extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCreate() {
        groupService.createGroup(
            {
                "name": this.refs.groupName.value,
                "description": this.refs.description.value,
                "groupMessage": this.refs.groupMessage.value
            }).then((result) => {
                alert("Group Created!");
                this.props.history.push('/group/' + result.data.id);
            }).catch( () => {
                alert("There was an error! Please re-check your form.");
            })
    }

    handleSubmit(event) {
        const {match : {params}} = this.props;
        this.handleCreate();
        event.preventDefault();
    }

    render() {
        return (
            <Fragment>
            <title>MoneySplit | New Group</title>
            <div className = "container">
            <h1>New Group</h1>
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Name*</label>
                    <input className="form-control" type="text" ref='groupName'/>

                    <br />

                    <label>Description*</label>
                    <input className="form-control" type="text" ref='description' />

                    <br />

                    <label>Group Message*</label>
                    <input className="form-control" type="text" ref='groupMessage' />

                    <br />

                    <input className="btn btn-primary" type="submit" value="Submit" />
                </div>
            </form>
            </div>
            </Fragment>
        );
    }
}

export default GroupCreate;
