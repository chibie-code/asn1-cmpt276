// grades list
 let grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03,
     49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];
// let grades = [49];

/* -------------- Declare all global variables -------------- */
// used to store the bounds of the corresponding grade letters
// whether the new grade prompt will be displayed or not
let promptIsEnabled = true;

const gradeBounds = new Map();

// used to store the frequencies of the corresponding grade letters
const gradesTofrequencyMap = new Map();

const defaultGradeBounds = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 0];
const gradeLetters = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

// get max bound label element
let maxBoundLabelElement = document.getElementById("maxBoundLabel");
let maxBoundInputElement = document.getElementById(`${maxBoundLabelElement.htmlFor}`);

// set/initialize the default data values and show the histogram
gradeLetters.map((gletter, i) => gradeBounds.set(gletter, defaultGradeBounds[i]));
showHistogram(gradeBounds, grades);
/*  --------------  --------------  --------------  -------------- */

// handle toggle for new grade prompt
// promptIsEnabled = document.getElementById("enablePromptToggle").addEventListener("change", (ev) => {
//     promptIsEnabled = !promptIsEnabled;
//     // ev.target.checked
//     console.log("promptIsEnabled:", promptIsEnabled);
// });


// Handle "new grade" input box
let newGradeInputBox = document.getElementById('newGradeInputBox');
newGradeInputBox.addEventListener("change", evChange => {
    console.log("change!");
    handleShowAlertMsg(evChange.target, isValidNumber(evChange.target));
});
newGradeInputBox.addEventListener('keydown', (evKeyDown) => handleNewGradeInput(evKeyDown, gradeBounds, grades));
function handleNewGradeInput(evKeyDown, gradeBounds, grades){
    try {
        let newValue = parseInt(evKeyDown.target.value);
        let isValidNumberEntered = isValidNumber(evKeyDown.target);
        if (evKeyDown.key == "Enter") {
            console.log("Enter keyPress!");
            // this input element's value as well as the values of the bounds should be valid
            if (isValidNumberEntered){
                // push value to grades array
                grades.push(newValue);
                // show updated histogram
                showHistogram(gradeBounds, grades);
                console.log("Enter keyPress!", grades, maxBoundInputElement.value, newValue);
            }else {
                handleShowAlertMsg(evKeyDown.target, isValidNumberEntered);
            }
        }
    }
    catch(error){
        console.error("Error on key press in ", error)
    }
};

// Handle "lower bounds" input boxes
let boundLabels = document.getElementsByName('boundLabel');
boundLabels.forEach((labelElement) => {
    let letterGrade = labelElement.innerHTML;
    let associatedInputElement = document.getElementById(`${labelElement.htmlFor}`);
    associatedInputElement.addEventListener('change', (evChange) => handleBoundInput(evChange, letterGrade, gradeBounds, grades));
});
function handleBoundInput(evChange, gradeLetter, gradeBounds, grades) {
    let boundValue = parseInt(evChange.target.value);
    let isValidNumberEntered = isValidNumber(evChange.target);
    if (isValidNumberEntered){
        gradeBounds.set(gradeLetter, boundValue);
        console.log("Bound input Change", gradeBounds);
    }
    showHistogram(gradeBounds, grades);
    handleShowAlertMsg(evChange.target, isValidNumberEntered);
}

// number validation function
let isValidNumber = (targetElement) => {
    let valueIsNegative = parseInt(targetElement.value) < 0;
    let valueIsGreaterThanMax = parseInt(targetElement.value) > parseInt(maxBoundInputElement.value);
    let result = (!valueIsNegative && !valueIsGreaterThanMax);
    // handle whether to show or hide the alert error message for a particular input box
    return result;
};

function handleShowAlertMsg(targetElement, isValid) {
    
    console.log("isValid:", isValid);
    // iterate through all "output" elements to find the one associated with this target element
    document.getElementsByName("alertMsg")
    .forEach(alertMsgEle => {
        let doRemoveErrorMsg = !isValid;
        if (alertMsgEle.htmlFor.value === targetElement.id){
            // hide or show the alert message
            if (doRemoveErrorMsg){
                alertMsgEle.classList.remove("hiddenAlertMsg");
            }
            else {
                alertMsgEle.classList.add("hiddenAlertMsg");
            }
        }
    });
    if (isValid){
        targetElement.classList.remove("inputErrorFound");
    }
    else {
        targetElement.classList.add("inputErrorFound");
    }    
}

// validate all lower bounds input values
function isAllBoundsValid(){
    let boundLabelElements = document.getElementsByName("boundLabel");
    let allBoundsAreValid = true;
    // iterate over boundLabelElements to access their corresponding input elements
    boundLabelElements.forEach((ele) => {
        let associatedInputElementId = ele.htmlFor;
        // handle if its associatedInputElement's values are valid
        let associatedGradeBoundInputBox = document.getElementById(`${associatedInputElementId}`);
        let isValidNumberEntered = isValidNumber(associatedGradeBoundInputBox);
        if (!isValidNumberEntered){
            // each element will be validated and a singl invalid one will set this variable to false
            allBoundsAreValid = false;
        }
    });
    return allBoundsAreValid;
}

// handle adjusting max of each bound
document.getElementById("maxBoundInput")
.addEventListener("keydown", (ev) => {
    console.log("change max");
    try {
        console.log("isAllBoundsValid():", isAllBoundsValid());
        // handles bounds when max changed
        document.getElementsByName('boundInput').forEach((targetElement) => {
            // set the max for each bound input element
            let newMax = ev.target.value;
            targetElement.max = newMax;
        });
        // handles "new grade" input error when max changed
        let newGradeInputBox = document.getElementById("newGradeInputBox");
        handleShowAlertMsg(newGradeInputBox, isValidNumber(parseInt(newGradeInputBox.value)));
        // update histogram display
        showHistogram(gradeBounds, grades);
    } catch (error) {
        console.error(error);
    }
});

// function to show/display the histogram 
function showHistogram(gradesBoundsMap, gradesArray) {
    try {
        // update gradesToFreqMap
        updateGradesToFreqMap(gradesBoundsMap, gradesArray, gradesTofrequencyMap);

        // ASCII display for histogram
        asciiDisplayHistogram(gradesTofrequencyMap);
    } catch (error) {
        console.error(error);
    }
}

// update the values of the grades frequency Map
function updateGradesToFreqMap(gradesBoundsMap, gradesArray, gradesTofrequencyMap) {
    let higherBound = maxBoundInputElement.value;// starting with max bound
        for (const [keyLetterGrade, value] of gradesBoundsMap) {
            // count frequency of scores within each grade bound
            let initCount = 0;
            // count the freq within each bound/range
            const freqInThisBound = gradesArray.reduce(
                // higher/upperBound exclusive & lower bound inclusive
                (accum, currValue) => ((higherBound === maxBoundInputElement.value && currValue <= higherBound) || (higherBound != maxBoundInputElement.value && currValue < higherBound)) && currValue >= value ? accum + 1 : accum , initCount);

            // update grades to freq map
            gradesTofrequencyMap.set(keyLetterGrade, freqInThisBound);

            // update higherBound to next bound
            higherBound = value;
        }
}

// print an ascii display of the histogram
function asciiDisplayHistogram(gradesTofrequencyMap){
    try {
        // get all elements of the "histLabel" name and their associated div elements
        let histLabelElements = document.getElementsByName("histLabel");
        // iterate over histLabelElements to access their corresponding div elements
        histLabelElements.forEach((ele, i) => {
            let associatedDivElementId = ele.htmlFor;
            // set its associatedInputElement's innerHTML to the appropriate histogram bar ascii representation
            let histBarElement = document.getElementById(`${associatedDivElementId}`);
            let freqOfThisGradeLetter = gradesTofrequencyMap.get(ele.innerHTML);
            histBarElement.innerHTML = "█".repeat(freqOfThisGradeLetter);
        });
    } catch (error) {
        consol.error(error);
    }
}