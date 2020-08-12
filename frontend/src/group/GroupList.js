import React, {Component, Fragment} from 'react';
import GroupService from './GroupService';
import {Link} from 'react-router-dom';
import {Table} from 'react-bootstrap';

const groupService = new GroupService();

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            groups: []
        };
        this.render = this.render.bind(this);
    }

    componentDidMount() {
        var self = this;
        groupService.getGroups().then(function (result) {
            self.setState({groups: result, isLoaded: true});
        });
    }

    render() {
        const {isLoaded, groups} = this.state;
        if (isLoaded) {
            if (groups.length == 0) {
                return (
                    <Fragment>
                    <title>MoneySplit | Your Groups</title>
                    <div className="container">
                        <h1>You are not part of any group</h1>
                    </div>
                    </Fragment>
                )
            } else {
                return (
                    <Fragment>
                    <title>MoneySplit | Your Groups</title>
                    <div className="container">
                        <div className="groupList"><h1>Here are all the groups that you are part of:</h1>
                        <Table>
                            <tr>
                                <th>Name: </th>
                                <th>Description: </th>
                                <th>Message: </th>
                            </tr>
                            {groups.map(group =>
                                <tr>
                                    <td><Link to={"/group/" + group.id}>{group.name}</Link></td>
                                    <td>{group.description}</td>
                                    <td>{group.groupMessage}</td>
                                </tr>
                            )}
                        </Table>
                        </div>
                    </div>
                    </Fragment>
                )
            }
        } else {
            return (
                <p></p>

            )
        }
    }
}


export default GroupList;