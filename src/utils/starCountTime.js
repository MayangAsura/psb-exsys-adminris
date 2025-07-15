export function startCount(start_at, end_at, time, started_at){

    // $(document).ready(function(){
          var countDownDate = new Date(end_at).getTime() - new Date(start_at).getTime() - (new Date(time).getTime() - new Date(started_at).getTime());
          // strtotime(ended_at) - strtotime(started_at) - strtotime(time) - strtotime(start_at);
        //    <?= $data['waktu'] - (strtotime(date('Y-m-d H:i:s')) - strtotime($_SESSION['asesmen']['dimulai_pada'])) ?>
          // Update the count down every 1 second
          var x = setInterval(function() {
            countDownDate -= 1;
            var distance = countDownDate;
            // Time calculations for days, hours, minutes and seconds
            // var hours = Math.floor(distance / (60 * 60));
            // var minutes = Math.floor(distance / (60));
            // var seconds = Math.floor((distance % (60)));
            const hours = Math.floor(distance / 3600);
            const minutes = Math.floor((distance % 3600) / 60);
            const seconds = distance % 60;
            // Display the result in the element with id="demo"
            // return document.getElementById("timer").innerHTML = hours + " : " + minutes + " : " + seconds;
            // If the count down is finished, write some text 
            if (distance < 0) {
              clearInterval(x);
              return 0
              // document.getElementById("timer").innerHTML = "Waktu Habis";
              // document.getElementById("_mySubmit").click();
            }
            return hours + " : " + minutes + " : " + seconds;
          }, 1000);
        // });
}