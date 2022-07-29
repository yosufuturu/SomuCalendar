
// import modukles
import {getDateParam, extractDate} from './modules/date.js';

// modal.js
const mask = document.getElementById('mask');
const Registed = document.getElementById('Registed');
const itemlist = document.getElementById('memolist');

export default function modal ()
{
    const days = document.getElementById('cal_body');
    const close = document.getElementById('memo_close');
    const modal = document.getElementById('modal');

    days.addEventListener('click', function(e)
    {
        const dayPanel = e.target;
        let modal_date = document.querySelector('#date');
        

        mask.classList.remove('hidden');
        modal.classList.remove('hidden');


        modal_date.innerHTML = dateFormat(dayPanel, 'mheader');
        modal_date.dataset.id = dateFormat(dayPanel, 'dateId');

        loadData(dateFormat(dayPanel, 'dateId'));
    });


    Registed.addEventListener('click', function()
    {
        const getdate = document.getElementById('date').dataset.id
        const inputData = document.getElementById('input_memo').value;

        registedDatabase(getdate, inputData);
    });

    close.addEventListener('click', function(e)
    {
        e.stopPropagation();
        document.getElementById('input_memo').value = '';

        modalClose();

        itemlist.innerHTML = '';
    });

    function modalClose()
    {
        mask.classList.add('hidden');
        modal.classList.add('hidden');
    }

    itemlist.addEventListener('click', (e) => 
    {
        let a = e.target.closest('li').dataset.itemid;
        e.stopPropagation();

        console.log(parseInt(a));

        if (e.target.classList.contains('delete'))
        {
            itemDelete(a, e);
        }
    });


}

function createMemoItem(data, id)
{
    let newText = document.createElement('p');
    let newItem = document.createElement('li');

    newText.classList.add('ItemText');
    newText.innerText = data;

    newItem.classList.add('items');

    if (undefined != id)
    {
        newItem.dataset.itemid = id;
    }

    newItem.appendChild(newText);
    newItem.appendChild(createDeleteButton());

    return newItem;
}

function createDeleteButton ()
{
    let newClose = document.createElement('p');

    newClose.classList.add('delete');
    newClose.innerText = '×';

    return newClose;
}

function dateFormat(panel, mode)
{
    let data = extractDate(getDateParam(), panel);
    
    if ('mheader' === mode)
    {

        return  data[0] + '年 ' + data[1] + '月' + data[2] + '日';
    }
    else
    {
        return data[0] + ( '00' + data[1]).slice(-2) + ( '00' + data[2]).slice(-2);
    }

}

async function loadData(dateid)
{
    try
    {
        const response = await fetch("http://localhost:5005?mode=load&&dateid=" + dateid);
        const data = await response.json();

        if ('node' != data)
        {
            let idList = data.id;
            let memoList = data.memo;
            
            memoList.map((e, index) =>
            {
                addMemoList('DOM', createMemoItem(e, idList[index]));
            });

        }
    }
    catch (err)
    {
        console.log(error);
    }
}

function addMemoList(mode, data)
{
    let list = document.getElementById('memolist');

    if ('DOM' == mode)
    {
        list.appendChild(data);
    }
    else
    {
        list.appendChild(createMemoItem(data));
    }

}

async function registedDatabase(dateid, text)
{
    let createGetParam = "?mode=registed&&dateid=" + dateid + "&&text=" + text;
    try
    {
        const response = await fetch("http://localhost:5005" + createGetParam);

        const data = await response.json();
        if ('failed' != data)
        {
            addMemoList('DOM', createMemoItem(text, data));
        }

    }
    catch (err)
    {
        console.log(error);
    }
}

async function itemDelete(itemID, element)
{
    try
    {
        const response = await fetch("http://localhost:5005?mode=delete&&itemid=" + itemID);
        const data = await response.json();
        if ('SUCCESS' == data)
        {
            element.target.closest('li').remove();
            
        }


    }
    catch (err)
    {
        console.log(err);
    }
}