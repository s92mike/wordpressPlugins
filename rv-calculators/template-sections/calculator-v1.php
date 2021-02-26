<div id="nat-calc-wrapper">
    <div class="page-progress-bar">
        <div class="bar">
            <div class="filler"></div>
        </div>
    </div>
    <div class="process step-1">
        <h4>When was your first green card issued?</h4>
        <div class="datecontainer">
            <input type='text' class="form-control gc_date" id='nc-datepicker' />
        </div>
    </div>
    <div class="process step-2">
        <h4>Is your current green card still valid?</h4>
        <div class="gc_current">
            <button class="gc_valid button conditional" data-answer="Yes">Yes</button>
            <button class="gc_valid button conditional" data-answer="No">No</button>
        </div>
    </div>
    <div class="process step-3">
        <h4>Did you obtain your green card through marriage to a US citizen?</h4>
        <div class="obtain">
            <button class="gcm button conditional" data-answer="Yes">Yes</button>
            <button class="gcm button conditional" data-answer="No">No</button>
        </div>
    </div>
    <div class="process step-4">
        <h4>What is your current Green Card?</h4>
        <div class="obtain">
            <button class="type button conditional" data-answer="Yes">2 Years Green Card (Adjustment of Status)</button>
            <button class="type button conditional" data-answer="No">10 Years Green Card (Removal of Conditions)</button>
        </div>
    </div>
    <div class="process loader">
        <img src="<?php echo $args['src']; ?>" alt="">
    </div>
    <div class="successfull"></div>
    <div class="message"></div>
</div>