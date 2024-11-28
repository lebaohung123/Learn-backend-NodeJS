'use strict';

class AccessController{
    signUp = async (req, res, next) => {
        /*
            200 OK
            201 CREATED
        */
        try {
            console.log(`[P]::signUp:`, req.body)
            return res.status(201).json({
                code: '20001',
                metadata: {userid: 1}
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()