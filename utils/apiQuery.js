const { Query } = require("mongoose");
const { parse } = require("querystring");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

class ApiQuery {
  constructor(model) {
    this.model = model;
  }

  async findWithPagination(queryStr, userId) {
    // Parse the query string
    const queryObj = parse(queryStr);
    const { page = 1, limit = 10, sort } = queryObj;

    // Construct the filter criteria
    const filter = { userId };

    // Construct the options for pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? JSON.parse(sort) : { _id: -1 }, // Default sorting by _id in descending order
    };

    // Execute the query using mongoose-paginate-v2
    const result = await this.model.paginate(filter, options);

    return result;
  }

  async findWithFilterAndPagination(queryStr, userId) {
    // Parse the query string
    const queryObj = parse(queryStr);
    const { page = 1, limit = 10, sort, fields } = queryStr;
    console.log(page, limit, sort, fields);

    // Construct the filter criteria
    const filter = { userId };

    // Construct the options for pagination and field selection
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? sort : { _id: -1 }, // Default sorting by _id in descending order
      select: fields ? fields.split(",").join(" ") : "",
    };

    // Execute the query using mongoose-paginate-v2
    const result = await this.model.paginate(filter, options);

    return result;
  }
}

module.exports = ApiQuery;
