const { Component, PureComponent } = React;
const __progress = 'progress';
const __process = 'process';
const __summary = 'summary';
const __error = 'error';
const __loader = 'loader';
const __sequence = [
    __progress,
    __process,
    __loader,
    __summary
]

class YesNoButton extends PureComponent {
    updateButton = (val) => {
        const { marriage, validity, onClick, updateStateCurrent } = this.props;
        if (marriage) {
            onClick({ married: val });
        }
        if (validity) {
            onClick({ valid: val });
        }
        updateStateCurrent();
    }
    render() {
        const { updateButton } = this;
        return (
            <div class="button-container">
                <button class="button conditional" onClick={updateButton.bind(this, true)}>Yes</button>
                <button class="button conditional" onClick={updateButton.bind(this, false)}>No</button>
            </div>
        );
    }
}

YesNoButton.defaultProps = {
    marriage: false,
    validity: false
}

class LoaderCustom extends PureComponent {
    render() {
        return (<div className="loader">
            <img src="/wp-content/plugins/rv-green-card-calculator/images/rapidvisathrobber.gif" alt=""/>
        </div>);
    }
}

class DateTimePicker extends PureComponent {
    componentDidMount() {
        const { onChange, updateStateCurrent } = this.props;
        jQuery('#datetimepicker')
            .datetimepicker({ format: 'YYYY-MM-DD' })
            .on('dp.change', function () {
                const dateValue = jQuery(this).val();
                if ( dateValue.length > 0 ) {
                    onChange({ date: dateValue });
                }
            }).on('dp.hide', () => {
                updateStateCurrent();
            });
    }
    render() {
        return (<div class="datecontainer"><input type='text' class="form-control" id='datetimepicker' /></div>);
    }
}

class ProgressBar extends PureComponent {
    state = {
        progress: 0,
        complete: 100
    }
    componentDidMount() {
        this.timerID = setInterval(() => {
            this.tick();
        }, 10);
    }
    tick = () => {
        const { onClick } = this.props;
        const { progress, complete } = this.state;
        if (progress < complete) {
            this.setState( (prevQ) => {
                return { progress: prevQ.progress + 1 }
            });
        } else {
            clearInterval(this.timerID);
            onClick();
        }
    }
    render() {
        const { progress } = this.state;
        return(
            <div className="progress-bar react">
                <div className="bar">
                    <div 
                        className="filler" 
                        style={{ width: progress + '%' }}
                    ></div>
                </div>
            </div>
        );
    }
}

class ProcessStep extends PureComponent {
    state = {
        current: 0,
        maxSteps: 0,
        steps: [{
            title: '',
            component: ''
        }]
    }
    componentDidMount() {
        this.setState((prevState)=>{
            const { updateStateData } = this.props;
            const stepsData =  [
                {
                    title: <h4>When was your first green card issued?</h4>,
                    component: <DateTimePicker 
                        onChange={updateStateData} 
                        updateStateCurrent = {this.updateStateCurrent}/>
                },
                {
                    title: <h4>Is your current green card still valid?</h4>,
                    component: <YesNoButton 
                        validity={true} 
                        onClick={updateStateData}
                        updateStateCurrent = {this.updateStateCurrent} />
                },
                {
                    title: <h4>Did you obtain your green card through marriage to US a citizen?</h4>,
                    component: <YesNoButton 
                        marriage={true} 
                        onClick={updateStateData}
                        updateStateCurrent = {this.updateStateCurrent} />
                }
            ];
            return {
                ...prevState,
                maxSteps: stepsData.length - 1,
                steps: stepsData
            }
        });
    }
    updateStateCurrent = () => {
        const { maxSteps, current } = this.state;
        if (current < maxSteps) {
            this.setState((prevState) => {
                return { current: prevState.current + 1 };
            });
        } else {
            this.props.updateStateSeq();
        }
    }
    render() {
        const { steps, current } = this.state;
        const { title, component } = steps[current];
        return (
            <div class="process">
                { title }
                { component }
            </div>
        );
    }
}

class Main extends PureComponent {
    state = {
        seq: 0,
        data: {
            date: '',
            married: null,
            valid: null,
            kind: null
        }
    }
    componentChanger = () => {
        const { seq } = this.state;
        switch (__sequence[seq]) {
            case __progress:
                return <ProgressBar onClick={this.updateStateSeq.bind(this)} />;
            case __process:
                return <ProcessStep updateStateData={this.updateStateData.bind(this)} updateStateSeq={this.updateStateSeq} />;
            case __loader:
                return <LoaderCustom />;
            default: 
                return <div className='default'>Nothing!!!</div>;
        }
    }
    updateStateSeq = () => {
        this.setState((prevState)=>{
            return { seq: prevState.seq + 1 }
        });
    }
    updateStateData = (updatedData) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    ...updatedData
                }
            }
        })
    }
    render() {
        return (this.componentChanger());
    }
}
ReactDOM.render(<Main />, document.getElementById('nat-calculator'));