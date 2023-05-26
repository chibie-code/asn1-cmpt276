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
let maxBoundInputElement = document.getElementById(maxBoundLabelElement.htmlFor);
/*  --------------  --------------  --------------  -------------- */

// handle toggle for new grade prompt
promptIsEnabled = document.getElementById("enablePromptToggle").addEventListener("change", (ev) => {
    promptIsEnabled = !promptIsEnabled;
    // ev.target.checked
    console.log("promptIsEnabled:", promptIsEnabled);
});

// number validation function
let isValidNumber = (value) => {
    let isValid = true;
    if (value < 0 || value > parseInt(maxBoundInputElement.value)){
        alert("No change made. Please enter a valid number between 0 and Max(" + maxBoundInputElement.value + ")");
        isValid = false;
    }
    return isValid;
};

// set/initialize the default data values and show the histogram
gradeLetters.map((gletter, i) => gradeBounds.set(gletter, defaultGradeBounds[i]));
showHistogram(gradeBounds, grades);

// Handle bounds inputs
// get all elements of the "boundLabel" name and their associated input elements
let boundLabelElements = document.getElementsByName("boundLabel");
// iterate over boundLabelElements to access their corresponding input elements
boundLabelElements.forEach((ele, i) => {
    let associatedInputElementId = ele.htmlFor;
    // handle if its associatedInputElement's value changes
    document.getElementById(`${associatedInputElementId}`).addEventListener("change", (ev) => {
        try {
            let associatedInputElementValue = ev.target.value;
            let thisLabelGradeLetter = ele.innerHTML;

            if (isValidNumber(associatedInputElementValue)){
                // update the gradeBounds map's grade letter bound
                gradeBounds.set(thisLabelGradeLetter, associatedInputElementValue);

                // show updated histogram
                showHistogram(gradeBounds, grades);
            }            
        }
        catch(error){
            console.error("Error on key press in ", error)
        }
    });
});

// validate all lower bounds input values
function isAllBoundsValid(bounds){
    let boundLabelElements = document.getElementsByName("boundLabel");
    let allBoundsAreValid = true; 
    // iterate over boundLabelElements to access their corresponding input elements
    boundLabelElements.forEach((ele, i) => {
        let associatedInputElementId = ele.htmlFor;
        // handle if its associatedInputElement's values are valid
        let associatedGradeBoundInputValue = document.getElementById(`${associatedInputElementId}`).value;
        if (!isValidNumber(associatedGradeBoundInputValue)){
            alert("One or more of the bounds has an invalid value. Change it");
            allBoundsAreValid = false;            
        }
    });
    return allBoundsAreValid;
}

// Handle the New Grade input box for new grades entered
let newGradeInputBox = document.getElementById('newGradeInputBox');
newGradeInputBox.addEventListener('keydown', (ev) => {
    try {
        let newValue = ev.target.value;
        if (ev.key === "Enter") {
            // new grade input validation
            if (isValidNumber(newValue)){
                // also check if the bounds text boxes have valid numbers
                if (isAllBoundsValid()){
                    // is prompt toggle option enabled?
                    if (document.getElementById("enablePromptToggle").checked){
                        if (confirm(`Add ${newValue} as a new grade score`)){
                            console.log("Okay!");
                            // add the new grade
                            grades.push(parseInt(newValue));

                            // show updated histogram
                            showHistogram(gradeBounds, grades);
                        }
                        else{
                            // do not add the new grade
                            console.log("Cancel!");
                        }
                    }
                    else {
                        // add the new grade
                        grades.push(parseInt(newValue));

                        // show updated histogram
                        showHistogram(gradeBounds, grades);
                    }
                }                
            }
            console.log("Enter keyPress!", grades, maxBoundInputElement.value, newValue);
        }
        else {
            console.log("keyPress!");
        }
    }
    catch(error){
        console.error("Error on key press in ", error)
    }
});


// handle max bound value change
maxBoundInputElement.addEventListener("change", (ev) => {
    try {
        boundLabelElements.forEach((ele, i) => {
            let associatedInputElementId = ele.htmlFor;
            // set the max for each bound input element
            let newMax = ev.target.value;
            let associatedInputElement = document.getElementById(`${associatedInputElementId}`);
            associatedInputElement.max = newMax;
        });
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
                (accum, currValue) => ((higherBound == maxBoundInputElement.value && currValue <= higherBound) || (higherBound != maxBoundInputElement.value && currValue < higherBound)) && currValue >= value ? accum + 1 : accum , initCount);

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