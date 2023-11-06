const { BookingRepository } = require("../repository/index");
const axios = require('axios');

const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require("../utils/errors");
class BookingService {
    constructor() {
        this.bookngRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
             const getflightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getflightRequestURL);
            // for price fetching
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the booking proccess', 'insufficient seats in the flight'); //service error demands message and explanation
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.bookngRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking =   await this.bookngRepository.update(booking.id,{status: "Booked"});
            return finalBooking;
            
        } catch (error) {
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            // console.log(" error in service layer ");
            throw new ServiceError();
        }
    }

    async update(bookingId, data) {
        try {
            await BookingRepository.update(data, {
                where: {
                    id: bookingId
                }
            });
            return true;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot update booking',
                'there was some issue updating the booking , please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
             );
        }
    }

}

module.exports = BookingService;
