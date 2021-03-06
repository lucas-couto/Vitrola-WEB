const Artists = require('./Artists')
const Album = require('../../../API/Album')
const Similar = require('../../../API/similarArtist')
const withoutMbid = require('../withoutMbid/withoutMbid')
const { putWithoutMbidDB } = require('../withoutMbid/withoutMbidCattegory')
const { putSimilarRLDB } = require('../Relational_Tables/Artists_Similar/Artists_SimilarCattegory')


let newArtistMbid
let existArtist
let hours
let minutes
// Colocar as informações no banco de dados.
async function putArtistDB(artistMbid, artistName, artistBiography, artistUrl, artistDirectoryImage, principalArtistMbid, withoutMbidParam) {
    newArtistMbid = null
    existArtist = false
    data = new Date()
    hours = data.getHours()
    minutes = data.getMinutes()
    if (withoutMbidParam) {
        newArtistMbid = await putArtistWithoutMbidDB(artistMbid, artistName, artistBiography, artistUrl, artistDirectoryImage)
    } else {
        await putArtistWithMbidDB(artistMbid, artistName, artistBiography, artistUrl, artistDirectoryImage)
    }
    await Album.getTopAlbums(newArtistMbid || artistMbid, artistName)
    if (principalArtistMbid) {
        //Cadastra o artista principal com o seu similar
        await putSimilarRLDB(principalArtistMbid, newArtistMbid || artistMbid)
        //Cadastra o artista similar com o seu principal
        await putSimilarRLDB(newArtistMbid || artistMbid, principalArtistMbid)
    }
    else
        await Similar.getSimilar(newArtistMbid || artistMbid, artistName)
}

// Essa funcao tem o objetivo de colocar um artista sem Mbid no banco de dados.
async function putArtistWithoutMbidDB(artistMbid, artistName, artistBiography, artistUrl, artistDirectoryImage) {
    existArtist = await Artists.findOne({ where: { name: artistName, url: artistUrl } })
    if (!existArtist) {
        existArtist = await withoutMbid.findOne({ where: { name: artistName, type: 'artist' } })
        if (existArtist) {
            console.log('\x1b[31m%s\x1b[0m', `${hours}:${minutes} - Artista sem Mbid ja cadastrado!`)
            return existArtist.dataValues.newMbid
        } else {
            await Artists.create({
                artist_mbid: artistMbid,
                name: artistName,
                biography: artistBiography,
                url: artistUrl,
                directoryImage: artistDirectoryImage
            }).then(() => {
                console.log('\x1b[32m%s\x1b[0m', `${hours}:${minutes} - Artista sem Mbid cadastrado com sucesso!`)
            }).catch(e => {
                console.log(e)
            })
            await putWithoutMbidDB(artistMbid, artistName, null, 'artist')
            return null
        }
    } else {
        return existArtist.dataValues.artist_mbid
    }
}

// Essa funcao tem o objetivo de colocar um artista com Mbid no banco de dados.
async function putArtistWithMbidDB(artistMbid, artistName, artistBiography, artistUrl, artistDirectoryImage) {
    existArtist = await Artists.findOne({ where: { artist_mbid: artistMbid } })
    if (existArtist)
        console.log('\x1b[31m%s\x1b[0m', `${hours}:${minutes} - Artista ja cadastrado!`)
    else {
        await Artists.create({
            artist_mbid: artistMbid,
            name: artistName,
            biography: artistBiography,
            url: artistUrl,
            directoryImage: artistDirectoryImage
        }).then(() => {
            console.log('\x1b[32m%s\x1b[0m', `${hours}:${minutes} - Artista cadastrado com sucesso!`)
        }).catch(e => {
            console.log(e)
        })
    }
}

module.exports = { putArtistDB }