function getTile(title, img, address)
{
    return  '<a href="'+ address + '">' +
               '<div class="tile">' +
                   '<h2>' + title + '</h2>' +
                   '<img class="screenshot" src="Gallery/' + img + '.png"></img>' +
                '</div>' +
           '</a>'; 
}

function getAssignmentTile(number, address='')
{
    if(address == '')
    {
        address = 'Assignment' + number +'/index.html';
    } 
    var title = 'Assignment' + number;
    var img = number;
    return getTile(title, img, address);
}

$('document').ready(() =>
{
    for(var i =1; i < 26; i++)
    {
        if(i == 9 || i == 10 || i == 11 || i == 14)
        {
            $('#tileDiv').append(getAssignmentTile(i, 'http://la558.xprtnk47cj.us-east-1.elasticbeanstalk.com/Assignment'+ i));
        }
        else if(i==24)
        {
            $('#tileDiv').append(getAssignmentTile(i, 'https://sphadley.carto.com/builder/c801ecf4-2a2d-11e7-952a-0ef24382571b/embed'));
        }
        else
        {
            $('#tileDiv').append(getAssignmentTile(i));
        }
    }
    $('#tileDiv').append(getTile('Mini Project', 'mini', 'http://la558.xprtnk47cj.us-east-1.elasticbeanstalk.com/MiniProject'));
    $('#tileDiv').append(getTile('Tech Report', 'report', 'la558-tech-report.pdf'));
    $('#tileDiv').append(getTile('Final Project', 'final', 'nearbeer.info'));
});
