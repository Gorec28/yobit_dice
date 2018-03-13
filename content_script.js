let start = 0.00001;
let current = start;
let worse_streak = 0;
let current_streak = 0;
let start_balance = 0;
let bets = 0;
let profit = 0;
let currency_id = 1037; // currency yobit id => 1037 =

$(document).ready(function() {

    $('.bet').val(start.toFixed(8));
    roll_dice();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function roll_dice(){
    bets++;
    $.ajax({
        method: "POST",
        url: "/ajax/system_dice.php",
        data: {
            method: "dice_play",
            csrf_token: $("#csrf_token").val(),
            locale: 'en',
            currency: currency_id,
            bet: current.toFixed(8),
            type: 1
        },
        "dataType": "json",
        "cache":    false,
    })
        .done(function( msg ) {
            console.log( "Dice outcome: " , msg );
            if(msg.win){
                current = start;
                current_streak = 0;
            }else{
                current *= 2;
                current_streak -= 1;
                if(current_streak < worse_streak){
                    worse_streak = current_streak;
                }
            }
            if(bets === 1){
                start_balance = msg.bal;
            }else{
                profit = msg.bal - start_balance;
            }
            console.log(
                "bets: ", bets,
                "worse streak: ", worse_streak,
                "streak: ", current_streak,
                "next bet: ", current.toFixed(8),
                "profit: ", profit.toFixed(8),
            );
            setTimeout(roll_dice, 900);
        });
}