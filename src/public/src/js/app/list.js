function _List () {
  var self = this
  this.Directory = new _Directory()
  this.Torrent = new _Torrent()
  this.TopMenu = new _TopMenu()

  this.table = $('.list table')
  this.body = $('.list table tbody')

  this.notif = new Pnotif()

  $.tablesorter.addParser({
    // set a unique id
    id: 'size',
    is: function (s) { return false },
    format: function (s) {
      s = s.split(' ')
      s[0] = parseInt(s[0], 10)
      if (s[1] === 'b') {
        return s[0]
      } else {
        s[0] *= 1024
        if (s[1] === 'kb') {
          return s[0]
        } else {
          s[0] *= 1024
          if (s[1] === 'mb') {
            return s[0]
          } else {
            s[0] *= 1024
            if (s[1] === 'gb') {
              return s[0]
            } else {
              s[0] *= 1024
              if (s[1] === 'tb') {
                return s[0]
              }
            }
          }
        }
      }
      // ['b', 'kb', 'mb', 'gb', 'tb']
      return 1
    },
    type: 'numeric'
  })

  $.tablesorter.addParser({
    // set a unique id
    id: 'date',
    is: function (s) { return false },
    format: function (s) {
      s = s.split('\/')

      return parseInt(s[0], 10) + parseInt(s[1], 10) * 30 + parseInt(s[2], 10) * 12
    },
    type: 'numeric'
  })

  self.table.tablesorter({
    headers: {
      0: { sorter: 'text' },
      1: { sorter: 'size' },
      2: { sorter: 'date' }
    }
  })

  this.directoryElements = {
    ariane: $('.top-menu .ariane'),
    size: $('.top-menu .folder-size'),

    newBut: $('.left-menu .new'),

    nameCol: $('.list #name'),
    sizeCol: $('.list #size'),
    dateCol: $('.list #date')
  }

  this.torrentElements = {
    input: $('.left-menu .torrent-input'),
    startBut: $('.left-menu .start'),
    searchBut: $('.left-menu .search'),

    nameCol: $('.list #name'),
    sizeCol: $('.list #size'),
    progressCol: $('.list #progress'),
    downCol: $('.list #down'),
    upCol: $('.list #up')
  }

  // click en dehors d'une ligne du table pour la deselectionner
  $('html').click(function () {
    $('.list .selected').children('#name').draggable('disable')
    $('.list .file').removeClass('selected')
    self.Directory.setActions('', {
      download: null,
      rename: null,
      remove: null,
      info: null
    })
    $('.list .torrent').removeClass('selected')
    self.Torrent.setActions('', {
      remove: null,
      info: null
    })
  })

  this.scrollTop = $('.scrollTop').click(function () {
    $('body').animate({
      scrollTop: 0
    }, 1000)
  })
}

_List.prototype.switchTable = function (nav) {
  this.body.html('')
  var key
  switch (nav) {
    case 'torrent':
      clearTimeout(this.Directory.timer)
      this.Torrent.getList()

      // hide directory elements
      for (key in this.directoryElements) {
        this.directoryElements[key].addClass('hide')
      }

      // show torrents elements
      for (key in this.torrentElements) {
        if (key === 'startBut') continue
        this.torrentElements[key].removeClass('hide')
      }

      this.notif.remove()
      this.notif.init('top-right', "<p style='padding: 10px; margin: 0px; color:red;'>Check that the file hasn't been downloaded before download.</p>", 5000)
      this.notif.draw()

      break
    case 'directory':
      window.location = '#'
      this.TopMenu.setAriane()
      clearTimeout(this.Torrent.timer)
      this.Directory.getList()

      // hide torrents elements
      for (key in this.torrentElements) {
        this.torrentElements[key].addClass('hide')
      }

      // show directory elements
      for (key in this.directoryElements) {
        this.directoryElements[key].removeClass('hide')
      }

      break
    default:
  }
}
