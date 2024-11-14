const moment = require('moment'); 

module.exports = {
  name: 'reminder',
  description: 'Set a reminder at a specific time and date with an optional reason',
  async execute(message, args) {
    if (args.length < 2) {
      return message.channel.send('Please provide both time and date in the format: !reminder [time] [date] [optional reason]');
    }

    
    const time = args[0]; 
    const date = args[1]; 
    
    const reason = args.slice(2).join(' ') || 'No reason provided'; 
    const reminderTime = `${date} ${time}`;

    if (!moment(reminderTime, 'DD/MM/YYYY HH:mm', true).isValid()) {
      return message.channel.send('Invalid date/time format. Please use the format: !reminder [time] [date]');
    }

    const reminderDate = moment(reminderTime, 'DD/MM/YYYY HH:mm');
    const delay = reminderDate.diff(moment(), 'milliseconds');

    if (delay <= 0) {
      return message.channel.send('The reminder time must be in the future!');
    }

    message.channel.send(`Reminder set for <@${message.author.id}> at ${reminderTime} with the reason: ${reason}`);

    setTimeout(() => {
      message.channel.send(`➡️ <@${message.author.id}> This is your reminder: ${reason}`);
    }, delay);
  },
};
