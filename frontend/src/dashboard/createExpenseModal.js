import React from "react";
import {Button, Modal} from "react-bootstrap";
import GroupService from "../group/GroupService";
import {useHistory} from 'react-router-dom';

const groupService = new GroupService()


export default class CreateExpenseModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "isShown": this.props.show,
            "groups": [],
            "selected_group": ""
        }
    }

    handleClose = () => {
        if (this.state.selected_group) {
            const path = `/expense/${this.state.selected_group}/new`
            this.props.history.push(path)
        }

        this.setState({
            "isShown": false,
        })
    }

    handleShow = () => {
        groupService.getGroups().then(data => {
            this.setState(
                {
                    "isShown": true,
                    "groups": data,
                }
            )
        })
    }

    handleGroupSelect = (e) => {
        let {_, value} = e.target;
        this.setState(
            {
                "selected_group": value
            }
        )
    }

    render() {
        return (
            <div style={this.props.style}>
                <Button variant="primary" onClick={this.handleShow}>
                    {this.props.children}
                </Button>
                <Modal
                    show={this.state.isShown}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    dialogClassName="create-expense-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Choose a group to create an expense for</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="pr-2" htmlFor="groups">Choose a group:</label>
                        <select onChange={this.handleGroupSelect} name="Groups" id="groups" defaultValue="defaultValue">
                            <option disabled value="defaultValue"> -- select an option --</option>
                            {this.state.groups.map((d, index) => {
                                return (
                                    <option key={index} value={d['id']}>{d['name']}</option>
                                )
                            })}
                        </select>
                        <span className="ml-1">Or </span>
                        <a href="/group/create">Create a new group</a>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" disabled={this.state.selected_group === ""}
                                onClick={this.handleClose}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}