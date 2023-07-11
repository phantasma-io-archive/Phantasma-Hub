#!/bin/bash
SCREEN_NAME="contract_web"
RUN_COMAND="start.sh"
RUN_AUTO_COMAND="autostart.sh"

#screen -AmdS p_web bash start.sh
#screen -r $(screen -ls | awk -F . "/\.$p_web\t/ {print $1}" | awk '{print $1}') -X quit

function start {
    if status; then echo "$SCREEN_NAME is already running"; exit 1; fi

    screen -AmdS $SCREEN_NAME "bash $RUN_COMAND"
}

function autostart {
    if status; then echo "$SCREEN_NAME is already running"; exit 1; fi

    screen -AmdS $SCREEN_NAME bash $RUN_AUTO_COMAND
}


function stop {
    if ! status; then echo "$SCREEN_NAME could not be found. Probably not running."; exit 1; fi

    if [ `whoami` = root ]
    then
        tmp=$(su - $USER -c "screen -ls" | awk -F . "/\.$SCREEN_NAME\t/ {print $1}" | awk '{print $1}')
        su - $USER -c "screen -r $tmp -X quit"
    else
        screen -r $(screen -ls | awk -F . "/\.$SCREEN_NAME\t/ {print $1}" | awk '{print $1}') -X quit
    fi
}

function console {
    if ! status; then echo "$SCREEN_NAME could not be found. Probably not running."; exit 1; fi

    if [ `whoami` = root ]
    then
        tmp=$(su - $USER -c "screen -ls" | awk -F . "/\.$SCREEN_NAME\t/ {print $1}" | awk '{print $1}')
        su - $USER -c "screen -r $tmp"
    else
        screen -r $(screen -ls | awk -F . "/\.$SCREEN_NAME\t/ {print $1}" | awk '{print $1}')
    fi
}

function status {
  if [ `whoami` = root ]
  then
    su - $USER -c "screen -ls" | grep [.]$SCREEN_NAME[[:space:]] > /dev/null
  else
    screen -ls | grep [.]$SCREEN_NAME[[:space:]] > /dev/null
  fi
}

function usage {
  echo "Usage: service pharming {start|autostart|stop|status|console}"
  echo "On console, press CTRL+A then D to stop the screen without stopping the server."
}

# Check required packages
PATH=/bin:/usr/bin:/sbin:/usr/sbin
if [ ! -x `which awk` ]; then echo "ERROR: You need awk for this script (try apt-get install awk)"; exit 1; fi
if [ ! -x `which screen` ]; then echo "ERROR: You need screen for this script (try apt-get install screen)"; exit 1; fi
if [ ! -x `which wget` ]; then echo "ERROR: You need wget for this script (try apt-get install wget)"; exit 1; fi
if [ ! -x `which tar` ]; then echo "ERROR: You need tar for this script (try apt-get install tar)"; exit 1; fi


case "$1" in

    start)
        echo "Starting $SCREEN_NAME..."
        start
        sleep 5
        echo "$SCREEN_NAME started successfully"
    ;;

    autostart)
        echo "Starting AutoStart $SCREEN_NAME..."
        autostart
        sleep 5
        echo "$SCREEN_NAME autostarted successfully"
    ;;
    
    stop)
        echo "Stopping $SCREEN_NAME..."
        stop
        sleep 5
        echo "$SCREEN_NAME stopped successfully"
    ;;

    console)
        echo "Open console on $SCREEN_NAME..."
        console
    ;;

    status)
        if status
        then echo "$SCREEN_NAME is UP"
        else echo "$SCREEN_NAME is DOWN"
        fi
    ;;
  
    restart)
      echo "Stopping $SCREEN_NAME..."
      stop
      sleep 2
      echo "Starting $SCREEN_NAME..."
      start
      sleep 5
      echo "$SCREEN_NAME restarted successfully"
    ;;

    *)
        usage
        exit 1
    ;;
esac