const { Component, PureComponent } = React;
const __applyForCitizenshipURL = 'https://rapidvisa.com/start-free/';
const __applyForCitizenshipText = 'applyForCitizenship';
const __progress = 'progress';
const __process = 'process';
const __summary = 'summary';
const __loader = 'loader';
const __sequence = [
    __progress,
    __process,
    __loader,
    __summary
]
const __defaultMain = {
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
const __numberInText = [
    'zero', 'one', 'two',
    'three', 'four', 'five'
]
const yesOrNoText = (flag) => {
    return flag ? 'Yes' : 'No';
}
const numberLeadingZero = (num) => {
    return num < 10 ? '0' + num : num;
}
const ninetyDaysEarlier = (currentDate) => {
    return currentDate - 90;
}
const yearsOfResident = ({ tempYear, yearsToCitizenship }) => {
    return parseInt(tempYear) + parseInt(yearsToCitizenship);
}
const displayDateFormat = (currentDate, separator) => {
    return currentDate.getFullYear() + separator + numberLeadingZero(currentDate.getMonth() + 1) + separator + numberLeadingZero(currentDate.getDate());
}
const calculateNaturalization = ({ date = '', yearsToCitizenship = 5 }) => {
    const currentDate = date.toString().split('-');
    let convtDate = new Date();
    if (currentDate.length >= 3) {
        const tempYear = currentDate[0];
        const tempMonth = currentDate[1]-1; //monthly starts with zero
        const tempDay = currentDate[2];
        convtDate = new Date( tempYear, tempMonth, tempDay );
        convtDate.setFullYear(yearsOfResident({ tempYear, yearsToCitizenship })); // 5 years for personal or 3 years for thru married to US citizen
        convtDate.setDate(ninetyDaysEarlier(convtDate.getDate())); //90 calendar days before for the complete your permanent resident    
    }
    return displayDateFormat(convtDate, "/");
}

class Buttons extends PureComponent {
    state = {
        startOver: {
            title: 'Start Over',
            className: ''
        },
        applyForCitizenship: {
            title: 'Apply for Citizenship',
            className: ' orange'
        }
    }
    updateState = () => {
        const { currentButton, resetState } = this.props;
        if ( currentButton === 'startOver' ) {
            resetState();
        } else if ( currentButton === __applyForCitizenshipText ) {
            window.location = __applyForCitizenshipURL;
        }
    }
    render() {
        const { currentButton } = this.props;
        const { title, className } = this.state[currentButton];
        return (<button onClick={this.updateState.bind(this)} className={'button conditional' + className }>{ title }</button>);
    }
}

Buttons.defaultProps = {
    currentButton: 'startOver'
}
class TwoButtons extends PureComponent {
    state = {
        yesNo: {
            first: 'Yes',
            second: 'No',
            myClassName: ''
        },
        type: {
            first: '2 Years Green Card (Adjustment of Status)',
            second: '10 Years Green Card (Removal of Conditions)',
            myClassName: ' kind'
        }
    }
    updateButton = (val) => {
        jQuery('#nat-calculator .process').fadeOut('slow', () => {
            const { marriage, validity, onClick, updateStateCurrent, type } = this.props;
            if (marriage) {
                onClick({ married: val });
            }
            if (validity) {
                onClick({ valid: val });
            }
            if (type) {
                onClick({ kind: val })
            }
            updateStateCurrent({ marriage, val, type });
            jQuery('#nat-calculator .process').slideDown('slow');
        });
    }
    render() {
        const { updateButton } = this;
        const { current } = this.props;
        const { first, second, myClassName } = this.state[current];
        return (
            <div class="button-container">
                <button 
                    class={ "button conditional" + myClassName }
                    onClick={updateButton.bind(this, true)}>{ first }</button>
                <button 
                    class={ "button conditional" + myClassName } 
                    onClick={ updateButton.bind(this, false)}>{ second }</button>
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
class Summary extends Component {
    render() {
        const { data, natSched, yearsToCitizenship } = this.props;
        return (<div className='summary'>
            <h4>Green Card issued: <b>{data.date}</b></h4>
            <h4>Green Card obtained through marriage to a US citizen: <b>{yesOrNoText(data.married)}</b></h4>
            <h4 className="valid">Green Card validity: <b>{yesOrNoText(data.valid)}</b></h4>
            <h4 className="success-react">The soonest you can apply for citizenship is: <b>{natSched}</b></h4>
            <span>(90 days before your {yearsToCitizenship} years permanent residency; Date format: YYYY/MM/DD)</span>
            {data.kind ? <p><b>Disclaimer: </b>You need a 10 Year Green Card (Removal of Condition) to apply for Naturalization Citizenship (Call us at 800-872-1458 for help)</p> :''}
        </div>)
    }
}

Summary.defaultProps = {
    data: {
        date: '',
        married: null,
        valid: null
    },
    natSched: '',
    yearsToCitizenship: ''
}

class SuccessButton extends PureComponent {
    toBeDisplay = (flag) => {
        return flag ? <Buttons currentButton={__applyForCitizenshipText} /> : '';
    }
    render() {
        return (this.toBeDisplay(this.props.flag));
    }
}

SuccessButton.defaultProps = {
    flag: false
}
class DisplayComponent extends PureComponent {
    state = {
        message: {
            validity: {
                content: <h4>If your green card is no longer valid, you are not eligible to apply for citizenship<b>(Call us at 800-872-1458 for help)</b></h4>,
                divClassName: 'error-react'
            },
            married2YGC: {
                content: <h4>If you don't have 10 Years Green Card(Removal of Conditions), you are not eligible to apply for citizenship <b>(Call us at 800-872-1458 for help)</b></h4>,
                divClassName: 'info'
            }
        }
    }
    displaySummary = (arg) => {
        const yearsToCitizenship = arg.married ? 3 : 5;
        const natSched = calculateNaturalization({ date: arg.date, yearsToCitizenship });
        return <Summary data={arg} natSched={natSched} yearsToCitizenship={__numberInText[yearsToCitizenship]} />
    }
    preDefinedMessage = ({ type, data, forMarried }) => {
        let display;
        switch (type) {
            case 'validity':
                type = forMarried ? 'married2YGC' : type;
                display = {
                    ...this.state.message[type]
                }
                break;
            case 'success':
                display = {
                    content: this.displaySummary(data),
                    divClassName: 'success-react'
                }
                break;
            default:
                display = {
                    content: <h4>No message type of preDefinedMessage function</h4>,
                    divClassName: 'error-react'
                }
                break;
        }
        return display;
    }
    render() {
        const { type, resetState } = this.props;
        const { content, divClassName } = this.preDefinedMessage(this.props);
        return (
            <div className={divClassName}>
                <div className='message-react'>
                    {content}
                </div>
                <div classname='buttons'>
                    <Buttons resetState={resetState} />
                    <SuccessButton flag={type === 'success'} />
                </div>
            </div>
        );
    }
}

DisplayComponent.defaultProps = {
    type: 'validity',
    forMarried: null,
    data: {
        date: '',
        married: null,
        valid: null,
        kind: null
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
                jQuery('#nat-calculator .process').fadeOut('slow', function() {
                    updateStateCurrent();
                    jQuery(this).slideDown('slow')
                });
            });
    }
    render() {
        return (<div class="datecontainer"><input type='text' class="form-control" id='datetimepicker' /></div>);
    }
}

class LoaderCustom extends PureComponent {
    componentDidMount() {
        this.timerID = setTimeout(this.tick, 1000);
    }
    tick = () => {
        jQuery('#nat-calculator .loader').fadeOut('slow', () => {
            this.props.updateStateSeq();
            jQuery('#nat-calculator .sucess-react').slideDown('slow');
        });
    }
    render() {
        return (<div className="loader">
            <img src="/wp-content/plugins/rv-green-card-calculator/images/rapidvisathrobber.gif" alt=""/>
        </div>);
    }
}

LoaderCustom.defaultProps = {
    updateStateSeq: () => { return; }
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
        const { timerID } = this;
        const { onClick } = this.props;
        const { progress, complete } = this.state;
        if (progress < complete) {
            this.setState( (prevQ) => {
                return { progress: prevQ.progress + 1 }
            });
        } else {
            clearInterval(timerID);
            jQuery('#nat-calculator .progress-bar.react').fadeOut('slow', onClick);
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
ProgressBar.defaultProps = {
    onClick: () => { return; }
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
                        marriage={true}
                        onClick={updateStateData} 
                        updateStateCurrent = {this.updateStateCurrent} />
                },
                {
                    title: <h4>What is your current Green Card?</h4>,
                    component: <TwoButtons
                        current='type'
                        type={true} 
                        onClick={updateStateData} 
                        updateStateCurrent = {this.updateStateCurrent}/>
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

ProcessStep.defaultProps = {
    married: null,
    forMarried: null,
    updateStateData: ()=>{ return; },
    updateStateSeq: ()=>{ return; }
}

class Main extends Component {
    state = {
        ...__defaultMain
    }
    componentChanger = () => {
        const { seq, data: { valid, married, kind }, data } = this.state;
        const forMarried = married && kind;
        if (valid === false || forMarried) {
            return <DisplayComponent forMarried = { forMarried } resetState = { this.resetState.bind(this) }/>;
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
                return <LoaderCustom updateStateSeq={this.updateStateSeq.bind(this)} />;
            case __summary: 
                return <DisplayComponent 
                    data={data}
                    type='success' 
                    resetState = {this.resetState.bind(this)}/>;
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
        return (this.componentChanger());
    }
}
ReactDOM.render(<Main />, document.getElementById('nat-calculator'));