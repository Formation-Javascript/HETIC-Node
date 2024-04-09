class APIFeatures {
  constructor(query, queryString) {
    /*
     * query : Mongoose query object
     * queryString : Query string from the URL
     */
    this.query = query; // exemple : School.find()
    this.queryString = queryString; // exemple : req.query (URL)
  }

  // 1) Filtering
  filter() {
    // 1) Filter
    const queryObj = { ...this.queryString };

    // On supprime les propriétés qui ne sont pas des filtres de recherche
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) On vérifie si une propériété de l'adresse est présente dans la requête
    // Si c'est le cas, on supprime la propriété 'country' de queryObj et on ajoute la propriété 'address.country' à queryObj par exemple

    // UNIQUEMENT POUR CE CAS PRÉCIS (adresse)🚨
    if ('country' in this.queryString) {
      delete queryObj.country;
      queryObj['address.country'] = this.queryString.country;
    } else if ('city' in this.queryString) {
      delete queryObj.city;
      queryObj['address.city'] = this.queryString.city;
    } else if ('zipCode' in this.queryString) {
      delete queryObj.zipCode;
      queryObj['address.zipCode'] = this.queryString.zipCode;
    }

    // 2) Filter Avancé
    let queryStr = JSON.stringify(queryObj);
    // On ajoute le signe $ devant les opérateurs de comparaison
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // $gte, $gt, $lte, $lt

    // lance la requête en base de données (en attente de résultats)
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2) Sorting
  sort() {
    // 3) Sorting (trie des résultats)
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // On remplace la virgule par un espace
      this.query = this.query.sort(sortBy); // "name price -rating"
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // 3) Limiting Fields (projection)
  limitFields() {
    // 4) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // On sélectionne les champs à afficher
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // 4) Pagination
  paginate() {
    // 5) Pagination
    // 1-5 -> page 1, 6-10 -> page 2, 11-15 -> page 3
    const page = this.queryString.page * 1 || 1; // Par défaut, on affiche la première page
    const limit = this.queryString.limit * 1 || 100; // Par défaut, on affiche 100 résultats par page
    const skip = (page - 1) * limit;
    // (3-1) * 10 = 20 (skip 20 résultats)

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
