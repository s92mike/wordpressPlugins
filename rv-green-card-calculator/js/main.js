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
const __defaultMain = {
    dev: true,
    seq: 0,
    data: {
        date: '',
        married: null,
        valid: null,
        kind: null
    }
}
const __defaultProcess = {
    current: 0,
    maxSteps: 0,
    steps: [{
        title: '',
        component: ''
    }]
}

class Buttons extends PureComponent {
    state = {
        currentButton: 'startOver',
        startOver: {
            title: 'Start Over',
            className: ''
        }
    }
    updateState = () => {
        if (this.state.currentButton === 'startOver') {
            this.props.resetState();
        }
    }
    render() {
        const { currentButton } = this.state;
        const { title, className } = this.state[currentButton];
        return (<button onClick={this.updateState.bind(this)} className={'button conditional' + className }>{ title }</button>);
    }
}
class TwoButtons extends PureComponent {
    state = {
        yesNo: {
            first: 'Yes',
            second: 'No'
        },
        type: {
            first: '2 Years Green Card (Adjustment of Status)',
            second: '10 Years Green Card (Removal of Conditions)'
        }
    }
    updateButton = (val) => {
        const { marriage, validity, onClick, updateStateCurrent, type } = this.props;
        if (marriage) {
            onClick({ married: val });
        }
        if (validity) {
            onClick({ valid: val });
        }
        updateStateCurrent({ marriage, val, type });
    }
    render() {
        const { updateButton } = this;
        const { current } = this.props;
        const { first, second } = this.state[current];
        return (
            <div class="button-container">
                <button class="button conditional" onClick={updateButton.bind(this, true)}>{first}</button>
                <button class="button conditional" onClick={updateButton.bind(this, false)}>{second}</button>
            </div>
        );
    }
}

TwoButtons.defaultProps = {
    current: 'yesNo',
    marriage: false,
    validity: false,
    type: false,
    updateStateCurrent: ()=>{return null;}
}

class ErrorDisplay extends PureComponent {
    state = {
        message: {
            validity: {
                content: 'If your green card is no longer valid, you are not eligible to apply for citizenship',
                bold: '(Call us at 800-872-1458 for help)'
            }
        }
    }
    render() {
        const { type, resetState } = this.props;
        const { content, bold } = this.state.message[type];
        return (
            <div className='error'>
                <div className='message'>
                    <h4>{content}</h4>
                    <b>{bold}</b>
                </div>
                <div classname='buttons'>
                    <Buttons resetState={resetState} />
                </div>
            </div>
        );
    }
}

ErrorDisplay.defaultProps = {
    type: 'validity'
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

class LoaderCustom extends PureComponent {
    render() {
        return (<div className="loader">
            <img src="/wp-content/plugins/rv-green-card-calculator/images/rapidvisathrobber.gif" alt=""/>
        </div>);
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
        ...__defaultProcess
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
                    component: <TwoButtons 
                        validity={true} 
                        onClick={updateStateData}
                        updateStateCurrent = {this.updateStateCurrent} />
                },
                {
                    title: <h4>Did you obtain your green card through marriage to US a citizen?</h4>,
                    component: <TwoButtons 
                        onClick={updateStateData}
                        marriage={true} 
                        updateStateCurrent = {this.updateStateCurrent} />
                },
                {
                    title: <h4>What is your current Green Card?</h4>,
                    component: <TwoButtons
                        current='type'
                        type={true} />
                }
            ];
            return {
                ...prevState,
                maxSteps: stepsData.length - 1,
                steps: stepsData
            }
        });
    }
    updateStateCurrent = (arg = { marriage: false, val: false, type: false }) => {
        const { maxSteps, current } = this.state;
        if (current < maxSteps && (!(arg.marriage && arg.val === false) || (arg.type && arg.val === false))) {
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
        ...__defaultMain
    }
    componentChanger = () => {
        const { seq, data: { valid, married } } = this.state;
        if (valid === false) {
            return <ErrorDisplay resetState = {this.resetState.bind(this)}/>;
        }
        switch (__sequence[seq]) {
            case __progress:
                return <ProgressBar onClick={this.updateStateSeq.bind(this)} />;
            case __process:
                return <ProcessStep 
                    married={married}
                    updateStateData={this.updateStateData.bind(this)} 
                    updateStateSeq={this.updateStateSeq} />;
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
    resetState = () => {
        this.setState({
            ...__defaultMain
        });
    }
    render() {
        const { dev } = this.state;
        if (dev) {
            return (<div>
                {this.componentChanger()}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0
                }}><Buttons resetState={this.resetState.bind(this)} /></div>
            </div>)
        }
        return (this.componentChanger());
    }
}
ReactDOM.render(<Main />, document.getElementById('nat-calculator'));