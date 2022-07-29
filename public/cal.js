
import modal from './modal.js';

/** Constants */
const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];       /* Define day of week. */
const today = new Date();                                             /* Get today object */
let showDate = new Date(today.getFullYear(), today.getMonth(), 1);    /* Declare a date object to display */


init_addEvents();



/** Init Display */
window.onload = function ()
{
    showProcess(today, calendar);
};

/**
 * It subtracts one month from the current date and then calls the showProcess() function to display
 * the new date.
 */
function before_month ()
{
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

/**********************************************************************************************************************
 * Function    : next_month
 * Discription : It adds one to the month of the showDate variable, and then calls the showProcess function to display
 *               the new month
 *********************************************************************************************************************/
function next_month ()
{
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

/** Calendar display */
/**
 * Function    : showProcess
 * Discription : It creates a calendar for the given year and month, and displays it on the page
 * @param date - The date object that is passed to the function.
 */
function showProcess (date)
{

    let year = date.getFullYear();
    let month = date.getMonth();

    document.querySelector('#cal_header').outerHTML = "<div id='cal_header'' value='" + year + '-' + (month + 1) + "'>" + year + "年 " + (month + 1) + "月</div";


    let calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
    modal();

    document.getElementById('cal_header').addEventListener('click', function(e) 
    {
        document.getElementById('mask').classList.remove('hidden');
        document.getElementById('jump_modal').classList.remove('hidden');
    });

}

/** Create Calendar */
function createProcess(year, month)
{

    /** get week */
    let calendar = "<table><thead><tr class='dayOfWeek'>";
    for (let i = 0; i < week.length; i++)
    {
        calendar += "<th>" + week[i] + "</th>";
    }

    calendar += "</tr></thead>";


    let count = 0;
    let startDayOfWeek = new Date(year, month, 1).getDay();
    let endDate = new Date(year, month + 1, 0).getDate();
    let lastMonthEndDate = new Date(year, month, 0).getDate();
    let row = Math.ceil((startDayOfWeek + endDate) / week.length);

    calendar += "<tbody id=\"cal_body\">";

    /** */
    for (var i = 0; i < row; i++)
    {
        calendar += "<tr>";

        for (var j = 0; j < week.length; j++)
        {
            if (i == 0 && j < startDayOfWeek)
            {
                
                /** Set the date of last month up to 1st in the first line */
                calendar += "<td><div id='dis_before_day_" + (lastMonthEndDate - startDayOfWeek + j + 1) + "' class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</div></td>";
            }
            else if (count >= endDate) {
                /** After the last day, the date of the next month is displayed */ 
                count++;
                calendar += "<td><div id=\"dis_next_day_" + (count - endDate) + "\" class='disabled'>" + (count - endDate) + "</div></td>";
            }
            else
            {
                count++;
                /** Set the date of the current month for the day of the week */
                if(year == today.getFullYear() && month == (today.getMonth()) && count == today.getDate())
                {
                    calendar += "<td class='today'><div id=\"day_"+ count +"\">" + count + "</div></td>";
                }
                else
                {
                    calendar += "<td><div id=\"day_"+ count +"\" class=\"days\">" + count + "</div></td>";
                }
            }
        }

        calendar += "</tr>";
    }

    calendar += "</tbody>";
    
    return calendar;
}

function init_addEvents()
{
    /* Adding an event listener to the element with the id of 'Before_month_js'. When the element is
    clicked, the function before_month() is called. */
    document.getElementById('Before_month_js').addEventListener('click', function()
    {
        before_month();
    });

    document.getElementById('next_month_js').addEventListener('click', function()
    {
        next_month();
    });

    document.getElementById('Shige_func').addEventListener('click', function()
    {
        showDate.setFullYear(today.getFullYear());
        showDate.setMonth(today.getMonth());
        showProcess(today, calendar);
    });

    document.getElementById('jump').addEventListener('click', function()
    {
        let s = document.getElementById('input_month').value.split('-');

        if ('' != s)
        {
            document.getElementById('mask').classList.add('hidden');
            document.getElementById('jump_modal').classList.add('hidden');

            showDate.setFullYear(parseInt(s[0]));
            showDate.setMonth(parseInt(s[1]) - 1);

            showProcess(showDate);
        }
        else
        {
            alert('年月を選択してください');
        }

    });

    document.getElementById('jump_cancel').addEventListener('click', function()
    {
        document.getElementById('mask').classList.add('hidden');
        document.getElementById('jump_modal').classList.add('hidden');
    });
}
