import React, { Component } from "react";
import ReactDOM from "react-dom";
import Acordion from "./acordion/acordion";
import ImgScale from "./imgScale/imgScale";
export default class Bitacora extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sl: 0,
            entrada: 0,
            salida: 0,
            tp: 0,
            lote: 0.01,
            par: "",
            riezgo: 1,
            pip: "0.0001",
            descripcion: "",
            foto: null,
            operaciones: []
        };
        this.Save = this.Save.bind(this);
        this.displayOperaciones = this.displayOperaciones.bind(this);
        this.getOperaciones = this.getOperaciones.bind(this);
    }
    Save(e) {
        console.log("foto", this.state.foto);
        if (this.state.foto !== null) {
            console.log("foto");
            const url = "http://localhost:8000/api/foto";
            const formData = new FormData();
            formData.append("file", this.state.foto);
            const config = {
                header: {
                    "content-type": "multipart/form-data"
                }
            };
            window.axios.post(url, formData, config).then(response => {
                console.log("Foto", response);
                window.axios
                    .post("http://localhost:8000/api/operaciones", {
                        sl: this.state.sl,
                        entrada: this.state.entrada,
                        salida: this.state.salida,
                        tp: this.state.tp,
                        lote: this.state.lote,
                        pip: this.state.pip,
                        descripcion: this.state.descripcion,
                        par: this.state.par,
                        foto: response.data
                    })
                    .then(response => {
                        if (response.status === 200) {
                            this.setState({
                                sl: "",
                                tp: "",
                                entrada: "",
                                salida: "",
                                lote: "",
                                descripcion: "",
                                par: "",
                                foto: null
                            });
                            this.getOperaciones();

                            console.log("Guardar archivo", response);
                        }
                    })
                    .catch(e => {
                        console.log("error", e);
                    });
            });
        } else {
            window.axios
                .post("http://localhost:8000/api/operaciones", {
                    sl: this.state.sl,
                    entrada: this.state.entrada,
                    salida: this.state.salida,
                    tp: this.state.tp,
                    lote: this.state.lote,
                    descripcion: this.state.descripcion,
                    par: this.state.par,
                    pip: this.state.pip,
                    foto: ""
                })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response);
                    }
                })
                .catch(e => {
                    console.log("error", e);
                });
        }

        e.preventDefault();
    }
    componentDidMount() {
        this.getOperaciones();
    }

    getOperaciones() {
        window.axios
            .get("http://localhost:8000/api/operaciones")
            .then(response => {
                if (response.status === 200) {
                    this.setState({ operaciones: response.data });
                    console.log(response);
                }
            });
    }
    round(num, decimales = 2) {
        var signo = num >= 0 ? 1 : -1;
        num = num * signo;
        if (decimales === 0)
            //con 0 decimales
            return signo * Math.round(num);
        // round(x * 10 ^ decimales)
        num = num.toString().split("e");
        num = Math.round(
            +(num[0] + "e" + (num[1] ? +num[1] + decimales : decimales))
        );
        // x * 10 ^ (-decimales)
        num = num.toString().split("e");
        return (
            signo * (num[0] + "e" + (num[1] ? +num[1] - decimales : -decimales))
        );
    }
    riezgo(el) {
        if (el.sl < el.entrada) {
            return this.round((el.tp - el.entrada) / (el.entrada - el.sl), 1);
        } else {
            return this.round((el.entrada - el.tp) / (el.sl - el.entrada), 1);
        }
    }
    pips(el) {
        return Math.abs(this.round((el.salida - el.entrada) / el.pip, 1));
    }
    ganancia(elemento) {
        if (elemento.sl < elemento.entrada) {
            console.log(elemento.salida / elemento.pip);
            console.log(elemento.salida * elemento.pip);
            console.log(
                (elemento.salida / elemento.pip -
                    elemento.entrada / elemento.pip) *
                    10 *
                    elemento.lote
            );

            return this.round(
                (elemento.salida / elemento.pip -
                    elemento.entrada / elemento.pip) *
                    10 *
                    elemento.lote
            );
        } else {
            return this.round(
                (elemento.entrada / elemento.pip -
                    elemento.salida / elemento.pip) *
                    elemento.lote *
                    10
            );
        }
    }
    elStyle(el) {
        if (el.salida === el.tp)
            return {
                borderLeftWidth: 5,
                borderLeftStyle: "solid",
                borderLeftColor: "#28a745"
            };
        else if (el.salida === el.sl)
            return {
                borderLeftWidth: 5,
                borderLeftStyle: "solid",
                borderLeftColor: "#dc3545"
            };
        else
            return {
                borderLeftWidth: 5,
                borderLeftStyle: "solid",
                borderLeftColor: "#6c757d"
            };
    }
    displayOperaciones() {
        const response = [];
        this.state.operaciones.forEach(element => {
            response.push(
                <div className="row my-3 py-2" style={this.elStyle(element)}>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-4">
                                <p>
                                    <b>Activo:</b> {element.par}
                                </p>
                                <p>
                                    <b>SL:</b> {element.sl}
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p>
                                    <b>Entrada:</b> {element.entrada}
                                </p>
                                <p>
                                    <b>TP:</b> {element.tp}
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p>
                                    <b>Salida:</b> {element.salida}
                                </p>
                                <p>
                                    <b>Ganancia: </b> {this.ganancia(element)}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p>
                                    <b>Riezgo / Beneficio:</b>{" "}
                                    {this.riezgo(element)}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p>
                                    <b>Pips movidos:</b> {this.pips(element)}
                                </p>
                            </div>
                            <div className="col-12">
                                <p>
                                    <b>Razón de entrada: </b> <br />
                                    {element.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <ImgScale
                            src={"storage/" + element.foto}
                        />
                    </div>
                </div>
            );
        });
        return response;
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 text-center mt-5">
                        <h1>Bitácora de trading</h1>
                    </div>
                </div>
                <Acordion title="Agregar operación">
                    <form onSubmit={this.Save}>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label htmlFor="entrada">Entrada</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={this.state.entrada}
                                    onChange={e => {
                                        this.setState({
                                            entrada: e.target.value
                                        });
                                    }}
                                    id="entrada"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="sl">SL</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={this.state.sl}
                                    onChange={e => {
                                        this.setState({ sl: e.target.value });
                                    }}
                                    id="sl"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="tp">TP</label>
                                <input
                                    type="text"
                                    value={this.state.tp}
                                    className="form-control form-control-sm"
                                    onChange={e => {
                                        this.setState({ tp: e.target.value });
                                    }}
                                    id="tp"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="salida">Salida</label>
                                <div className="d-flex justify-content-start">
                                    <input
                                        value={this.state.salida}
                                        onChange={e => {
                                            console.log(e.target.value);
                                            this.setState({
                                                salida: e.target.value
                                            });
                                        }}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="salida"
                                    />

                                    <button
                                        className="btn btn-sm btn-danger ml-1"
                                        onClick={e => {
                                            this.setState({
                                                salida: this.state.sl
                                            });
                                            e.preventDefault();
                                        }}
                                    >
                                        SL
                                    </button>
                                    <button
                                        className="btn btn-sm btn-success ml-1"
                                        onClick={e => {
                                            this.setState({
                                                salida: this.state.tp
                                            });
                                            e.preventDefault();
                                        }}
                                    >
                                        TP
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                className="form-control form-control-sm"
                                id="descripcion"
                                value={this.state.descripcion}
                                onChange={e => {
                                    this.setState({
                                        descripcion: e.target.value
                                    });
                                }}
                            ></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label htmlFor="par">Activo</label>
                                <input
                                    value={this.state.par}
                                    type="text"
                                    value={this.state.par}
                                    className="form-control form-control-sm"
                                    id="par"
                                    onChange={e => {
                                        this.setState({
                                            par: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <label htmlFor="pip">Pip</label>
                                <input
                                    value={this.state.pip}
                                    type="text"
                                    value={this.state.pip}
                                    className="form-control form-control-sm"
                                    id="pip"
                                    onChange={e => {
                                        this.setState({
                                            pip: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <label htmlFor="lote">Lote</label>
                                <input
                                    type="text"
                                    value={this.state.lote}
                                    className="form-control form-control-sm"
                                    id="lote"
                                    onChange={e => {
                                        this.setState({
                                            lote: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Foto</label>
                                <input
                                    type="file"
                                    id="single"
                                    className="form-control form-control-sm"
                                    onChange={e => {
                                        if (e.target.files.length > 0) {
                                            console.log(e.target.files[0]);
                                            this.setState({
                                                foto: e.target.files[0]
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <div
                                    className="d-flex align-items-end justify-content-end"
                                    style={{ height: "100%" }}
                                >
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-primary mr-1"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Acordion>
                {this.displayOperaciones()}
            </div>
        );
    }
}

if (document.getElementById("bitacora")) {
    ReactDOM.render(<Bitacora />, document.getElementById("bitacora"));
}
