import React, { Component } from "react";
export default class Acordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
    }

    render() {
        return (
            <div className={this.open ? "acordion open" : "acordion"}>
                <div style={styles.header}>
                    <p>{this.props.title}</p>
                    <a
                        onClick={() => {
                            this.setState({ open: !this.state.open });
                        }}
                    >
                        <img
                        style={(this.state.open)?{}:{display: 'none'}}
                            src="./images/up.png"
                            width="24px"
                            height="15px"
                        />
                        
                        <img
                        style={(this.state.open)?{display: 'none'}:{}}
                            src="./images/down.png"
                            width="24px"
                            height="15px"
                        />
                    </a>
                </div>
                <div style={(this.state.open)?{overflow: 'hidden'}:{height:0, overflow: 'hidden'}}>{this.props.children}</div>
            </div>
        );
    }
}
const styles = {
    header: {
        display: "flex",
        justifyContent: 'space-between',
    }
};
