import React, { Component } from "react";
export default class ImgScale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        return (
            <img
                src={this.props.src}
                className={(!this.state.open)?"img-fluid":''}
                style={
                    this.state.open
                        ? {
                              height: window.innerHeight,
                              width: window.innerWidth,
                              zIndex: 99,
                              position: "fixed",
                              top: 0,
                              left: 0,
                              cursor: 'pointer'
                          }
                        : {
                            cursor: 'pointer'
                        }
                }
                onClick={() => {
                    this.setState({ open: !this.state.open });
                }}
            />
        );
    }
}
const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between"
    }
};
