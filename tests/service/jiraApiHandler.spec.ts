import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Jira from '../../src/service/jiraApiHandler';
import * as request from 'request';
import MockResponse from '../mocks/jiraResponse.mock';


describe('JIRA API Handler', () => {
    let jira: Jira;
    let mockResponse: MockResponse;
    const sandbox = sinon.createSandbox();
    let mockStub;
    beforeEach(() => {
        mockResponse = new MockResponse();
        jira = new Jira();
        mockStub = sandbox.stub(request, 'get');
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Jira Status API with Ticket', (done) => {
        mockStub.yields(null, null, JSON.stringify(mockResponse.validTicket));
        jira.getTicketStatus('MO-49').then(response => {
            expect(response).to.have.property('fields');
            done();
        }).catch((error) => {
            done();
        });
    });
    it('Jira Status API with Ticket:error', (done) => {
        mockStub.yields('null', null, '');
        jira.getTicketStatus('').then(response => {
            done();
        }).catch((error) => {
            console.warn(error);
            done();
        });
    });

    it('JIRA Create Issue : Success', (done) => {
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(null, null, mockResponse.issueSuccessObj);
        jira.createIssue({}).then(result => {
            expect(result).to.have.property('key');
            done();
        });
    });

    it('JIRA Create Issue : Failute', (done) => {
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(new Error());
        jira.createIssue({}).catch(err => {
            expect(err).to.equal('API Failed');
            done();
        });
    });

});


