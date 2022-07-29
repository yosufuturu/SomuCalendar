
export function getDateParam()
{
    return document.getElementById('cal_header').textContent.match(/(?<year>\d+)年\s(?<month>\d+)月/,'');
}

export function extractDate(head, panel)
{
    const nextformat = new RegExp("dis_next_day_");
    const beforeformat = new RegExp("dis_before_day_");
    const currentformat= new RegExp("day_");

    let month = parseInt(head.groups.month);
    let year = parseInt(head.groups.year);
    let day;

    if (/dis_next_/.test(panel.id))
    {
        if (12 === month)
        {
            year += 1;
            month = 1;           
        }
        else
        {
            month += 1;
        }
        
        day = parseInt(panel.id.replace(nextformat,''));
       

    }
    else if (/dis_before_/.test(panel.id))
    {
        if (1 === month)
        {
            year -= 1;
            month = 12;
        }
        else
        {
            month -= 1;
        }

        day = panel.id.replace(beforeformat,'');

    }
    else
    {
        day = panel.id.replace(currentformat,'');
    }
    

    return [year, month, day]
}

function overYear(year, month, panelId)
{
    if (12 === month)
    {
        year += 1;
        month = 1;           
    }
    else
    {
        month += 1;
    }

    parseInt(panelId.replace(nextformat,''));

    return [year, month, day]        
}