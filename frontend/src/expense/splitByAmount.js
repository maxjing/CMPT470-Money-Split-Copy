import React, {Component} from 'react';

export default class SplitByAmount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "amount": isNaN(this.props.amount) ? 0 : this.props.amount,
            "groupMembers": this.props.groupMembers,
            "total": new Array(this.props.groupMembers.length).fill(0),
            "remaining": 100
        }
    }

    sum(arr) {
        return arr.reduce(function (a, b) {
            return a + b;
        }, 0)
    }

    onUpdate = (e) => {
        let val = e.target.value
        let index = e.target.id
        if (!isNaN(val)) {
            let f_val = parseFloat(val)
            let total = [...this.state.total]; // make a copy of array
            total[index] = f_val; // change its value
            this.setState({"total": total}); // update state
            // update parent state
            this.props.setState({
                "splitDistribution": [...total]
            })
        }
    }

    updateParent = (arr) => {

    }

    render() {
        return (
            <div className="card p-3">
                <h3>Split by amounts</h3>
                {this.state.groupMembers.map((member, index) => {
                    return (
                        <div key={member['id']} className="person d-flex pb-1">
                            <strong>{member['username']}</strong>
                            <div className="mr-auto"/>
                            $<input id={index} member_id={member['id']} onInput={e => this.onUpdate(e)} type="number"
                                    min="0" step="0.01"/>
                        </div>
                    )
                })}

                <div className="totals">
                    <div className="subtotals">
                        <strong>Total: </strong>
                        <span className="owed_total">${this.sum(this.state.total).toFixed(2)}</span>
                        <div className="remaining">
                            <span
                                className="owed_remaining">${(this.state.amount - this.sum(this.state.total)).toFixed(2)} left</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}