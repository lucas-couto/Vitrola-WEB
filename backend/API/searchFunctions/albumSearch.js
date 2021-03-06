const Albums = require('../../Database/Albums/Albums')
const Artists_Albums = require('../../Database/Relational Tables/Artists_Albums/Artists_Albums')
let exists

/*
Essa API é responsavel por retornar apenas as informações essenciais de um album.
Para chamar essa API precisamos do nome do album.
Ela é utilizada somente para a pesquisa do usuario.
*/
async function getAlbumSearch(name) {
    await Albums.findOne({ where: { name: name } })
        .then(album => {
            if (album) {
                exists = true
                albumMbid = album.album_mbid
                albumName = album.name
                albumImage = album.directoryImage
            } else {
                exists = false
            }
        })
        .catch(e => {
            console.log(e)
        })
    if (!exists) {
        return
    }
    await Artists_Albums.findOne({ where: { albums_mbid: albumMbid } })
        .then(artistAlbum => {
            artistMbid = artistAlbum.dataValues.artist_mbid
        })
        .catch(e => {
            console.log(e)
        })
    return {
        type: 'album',
        artistMbid,
        mbid: albumMbid,
        name: albumName,
        image: albumImage
    }
}

module.exports = getAlbumSearch