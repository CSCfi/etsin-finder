const accessTypeResponse = {
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 2,
    "successful": 2,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 9.069852,
    "hits": [
      {
        "_index": "reference_data",
        "_type": "_doc",
        "_id": "access_type_permit",
        "_score": 9.069852,
        "_source": {
          "id": "access_type_permit",
          "code": "permit",
          "type": "access_type",
          "uri": "http://uri.suomi.fi/codelist/fairdata/access_type/code/permit",
          "wkt": "",
          "input_file_format": "",
          "output_format_version": "",
          "label": {
            "fi": "Vaatii luvan hakemista Fairdata-palvelussa",
            "en": "Requires applying permission in Fairdata service",
            "und": "Vaatii luvan hakemista Fairdata-palvelussa"
          },
          "parent_ids": [],
          "child_ids": [],
          "has_children": false,
          "same_as": [
            "http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
          ],
          "internal_code": "hide",
          "scheme": "http://uri.suomi.fi/codelist/fairdata/access_type"
        }
      },
      {
        "_index": "reference_data",
        "_type": "_doc",
        "_id": "access_type_restricted",
        "_score": 9.069852,
        "_source": {
          "id": "access_type_restricted",
          "code": "restricted",
          "type": "access_type",
          "uri": "http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted",
          "wkt": "",
          "input_file_format": "",
          "output_format_version": "",
          "label": {
            "fi": "Saatavuutta rajoitettu",
            "en": "Restricted use",
            "und": "Saatavuutta rajoitettu"
          },
          "parent_ids": [],
          "child_ids": [],
          "has_children": false,
          "same_as": [
            "http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
          ],
          "internal_code": "",
          "scheme": "http://uri.suomi.fi/codelist/fairdata/access_type"
        }
      },
      {
        "_index": "reference_data",
        "_type": "_doc",
        "_id": "access_type_open",
        "_score": 8.688143,
        "_source": {
          "id": "access_type_open",
          "code": "open",
          "type": "access_type",
          "uri": "http://uri.suomi.fi/codelist/fairdata/access_type/code/open",
          "wkt": "",
          "input_file_format": "",
          "output_format_version": "",
          "label": {
            "fi": "Avoin",
            "en": "Open",
            "und": "Avoin"
          },
          "parent_ids": [],
          "child_ids": [],
          "has_children": false,
          "same_as": [
            "http://publications.europa.eu/resource/authority/access-right/PUBLIC"
          ],
          "internal_code": "",
          "scheme": "http://uri.suomi.fi/codelist/fairdata/access_type"
        }
      },
      {
        "_index": "reference_data",
        "_type": "_doc",
        "_id": "access_type_login",
        "_score": 8.688143,
        "_source": {
          "id": "access_type_login",
          "code": "login",
          "type": "access_type",
          "uri": "http://uri.suomi.fi/codelist/fairdata/access_type/code/login",
          "wkt": "",
          "input_file_format": "",
          "output_format_version": "",
          "label": {
            "fi": "Vaatii kirjautumisen Fairdata-palvelussa",
            "en": "Requires login in Fairdata service",
            "und": "Vaatii kirjautumisen Fairdata-palvelussa"
          },
          "parent_ids": [],
          "child_ids": [],
          "has_children": false,
          "same_as": [
            "http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
          ],
          "internal_code": "",
          "scheme": "http://uri.suomi.fi/codelist/fairdata/access_type"
        }
      },
      {
        "_index": "reference_data",
        "_type": "_doc",
        "_id": "access_type_embargo",
        "_score": 8.688143,
        "_source": {
          "id": "access_type_embargo",
          "code": "embargo",
          "type": "access_type",
          "uri": "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo",
          "wkt": "",
          "input_file_format": "",
          "output_format_version": "",
          "label": {
            "fi": "Embargo",
            "en": "Embargo",
            "und": "Embargo"
          },
          "parent_ids": [],
          "child_ids": [],
          "has_children": false,
          "same_as": [
            "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC"
          ],
          "internal_code": "",
          "scheme": "http://uri.suomi.fi/codelist/fairdata/access_type"
        }
      }
    ]
  }
}

export default accessTypeResponse
