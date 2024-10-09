const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'help',
    description:("Tất cả các lệnh mà bot này có!"),
    showHelp: false,

    async execute({ client, inter }) {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
            .setColor('#66FFFF')
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate('Mã này đến từ một dự án <Youtube> <[By Foxkun](https://www.youtube.com/@foxkun69)>.<\n>ib cho tui để lấy mã nhé.<\n> hãy tham gia máy chủ Discord hỗ trợ <[tại đây](https://discord.gg/VBEdD8JKZU)>.'))
            .addFields([{ name: `Đã bật - ${commands.size}`, value: commands.map(x => `\`${x.name}\``).join(' | ') }])
            .setTimestamp()
            .setFooter({ text: await Translate('Âm nhạc là số một - Được tạo ra với tất cả tình yêu từ Cộng đồng <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ embeds: [embed] });
    }
};
