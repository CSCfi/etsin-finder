const finnish = {
  addDataset: 'Lisää aineisto',
  changepage: 'Siirryit sivulle: %(page)s',
  dataset: {
    access_permission: 'Hae käyttölupaa',
    access_locked: 'Rajattu käyttöoikeus',
    access_open: 'Avoin',
    access_rights: 'Saatavuus',
    catalog_publisher: 'Katalogin julkaisija',
    citation: 'Sitaatti',
    citation_formats: 'Näytä lisää sitaattiehdotuksia',
    contact: {
      contact: 'Ota yhteyttä',
      email: {
        error: { required: 'Sähköposti vaaditaan!', invalid: 'Virhe sähköpostissa' },
        name: 'Sähköposti',
        placeholder: 'Anna sähköposti',
      },
      error: 'Virhe viestin lähetyksessä!',
      errorInternal: 'Internal server error! Please contact our support',
      message: {
        error: {
          required: 'Viesti vaaditaan!',
          max: 'Viestin maksimi pituus on 1000 merkkiä',
        },
        name: 'Viesti',
        placeholder: 'Syötä viesti',
      },
      recipient: {
        error: { required: 'Vastaanottaja vaaditaan!' },
        placeholder: 'Valitse vastaanottaja',
        name: 'Vastaanottaja',
      },
      send: 'Lähetä viesti',
      subject: {
        error: { required: 'Aihe vaaditaan!' },
        name: 'Aihe',
        placeholder: 'Anna aihe',
      },
      success: 'Viestin lähettäminen onnistui!',
    },
    contributor: {
      plrl: 'Muut tekijät',
      snglr: 'Muu tekijä',
    },
    creator: {
      plrl: 'Tekijät',
      snglr: 'Tekijä',
    },
    curator: 'Hoivaaja',
    dl: {
      breadcrumbs: 'Leivänmurut',
      category: 'Kategoria',
      dirContent: 'Kansion sisältö',
      download: 'Lataa',
      downloadAll: 'Lataa kaikki',
      fileAmount: '%(amount)s objektia',
      file_types: {
        both: 'tiedostot ja kansiot',
        directory: 'Kansio',
        file: 'tiedosto',
      },
      files: 'Tiedostot',
      info: 'Tietoja',
      info_about: 'aineistosta: %(file)s',
      item: 'aineisto %(item)s',
      name: 'Nimi',
      size: 'Koko',
      remote: 'Remote aineistot'
    },
    events_idn: {
      events: {
        title: 'Tapahtumat',
        event: 'Tapahtuma',
        who: 'Kuka',
        when: 'Milloin',
        description: 'Kuvaus',
      },
      other_idn: 'Muut tunnisteet',
      relations: {
        title: 'Relaatiot',
        type: 'Tyyppi',
        name: 'Otsikko',
        idn: 'Tunniste',
      },
    },
    doi: 'DOI',
    field_of_science: 'Tieteenala',
    funder: 'Rahoittaja',
    goBack: 'Palaa takaisin',
    identifier: 'Tunniste',
    infrastructure: 'Infrastruktuuri',
    keywords: 'Avainsanat',
    license: 'Lisenssi',
    permanent_link: 'Pysyvä linkki tälle sivulle',
    project: 'Projekti',
    publisher: 'Julkaisija',
    rights_holder: 'Oikeuksienhaltija',
    spatial_coverage: 'Maantieteellinen kattavuus',
    temporal_coverage: 'Ajallinen kattavuus',
    version: { number: 'Versio %(number)s', old: '(Vanha)' },
  },
  error: {
    notFound: 'Annetulle id:lle ei löytynyt metadataa',
    notLoaded: 'Hups! Ongelma latauksessa!',
  },
  general: {
    description: 'Kuvaus',
  },
  home: {
    title: 'Etsi aineistoa',
  },
  nav: {
    data: 'Data',
    dataset: 'Aineisto',
    datasets: 'Aineistot',
    events: 'Tunnisteet ja tapahtumat',
    help: 'Ohjeet & Info',
    home: 'Koti',
    organizations: 'Organisaatiot',
  },
  results: {
    amount: {
      plrl: '%(amount)s hakutulosta',
      snglr: '%(amount)s hakutulos',
    },
  },
  search: {
    placeholder: 'Anna hakusana',
    sorting: {
      best: 'Osuvimmat ensin',
      dateA: 'Vanhin ensin',
      dateD: 'Uusin ensin',
    },
  },
  slogan: 'Tutkimustenhaku palvelu',
  stc: 'Siirry sivun pääsisältöön',
  tombstone: {
    info: 'Aineisto on joko vanhentunut tai poistettu',
  },
}

export default finnish
