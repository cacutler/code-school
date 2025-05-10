let gpa_points = 0;
let get_gpa_button = document.getElementById("get-gpa");
let gpa_h3 = document.getElementById("gpa");
// TODO: - DONE
// Make this all of the input elements
// Make this a single line of code.
// Hint: get all of the document.query....All(".class-name")
// Hint: Please don't put my hint code exactly and expect it to work :)
let inputs = document.querySelectorAll(".gpa-input"); // finish the rest
let getGPA = () => {
    let gpa = 0;
    inputs.forEach((input) => {
        if (parseInt(input.value) >= 90) {
            gpa_points += 4;
        } else if (parseInt(input.value) >= 80) {
            gpa_points += 3;
        } else if (parseInt(input.value) >= 70) {
            gpa_points += 2;
        } else if (parseInt(input.value) >= 60) {
            gpa_points++;
        } else {
            gpa_points += 0;
        }
    });
    gpa = gpa_points / 4;
    // step 1 do the same but now for the gpa - DONE
    // step 2 loop through inputs: { - DONE
    // 		if a input value in inputs >= 90: gpaPoints += 4
    // 		elif a input value in inputs >= 80: gpaPoints += 3
    // 		elif a input value in inputs >= 70: gpaPoints += 2
    // 		elif a input value in inputs >= 60: gpaPoints += 1
    // 		else gpaPoints +=0
    // }
    // step 3 - after the loop now calculate the gpa - DONE
    // HINT This is gpaPoints divided by the number of classes (4 in this case)
    // return it - DONE
    return gpa;
};
get_gpa_button.onclick = () => {
    // if any of the inputs have a value that's empty { - DONE
    // 		return out and don't do anything :o
    // }
    // get the gpa using getGPA - DONE
    // set the h3 text to be the gpa - DONE
    // if gpa > 3.0 add the class of good-gpa to it - DONE
    let empty = false;
    if (!empty) {
        inputs.forEach((input) => {
            if (input.value === "") {
                empty = true;
            }
        });
    }
    if (empty) {
        return;
    }
    let gpa = getGPA();
    console.log(gpa);
    gpa_h3.innerHTML = gpa;
    if (gpa > 3.0) {
        gpa_h3.classList.add("good-gpa");
    }
};