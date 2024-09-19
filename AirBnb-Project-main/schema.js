const Joi = require('joi');

 
module.exports.listingSchema = Joi.object({
  listing : Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().uri().allow('', null) // Ensure url is a string and optionally a valid URI
      }).optional() // Ensure image object is present
    
    }).required()
});  
  

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
     rating: Joi.number().required().min(1).max(5), 
     comment: Joi.string().required(),
  }).required(),
}); 