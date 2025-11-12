import fetch from 'node-fetch';

export class TestRailClient {
  private baseUrl: string;
  private auth: string;

  constructor(baseUrl: string, username: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.auth = Buffer.from(`${username}:${apiKey}`).toString('base64');
  }

  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TestRail API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  // Get a specific test run
  async getRun(runId: number): Promise<any> {
    return await this.makeRequest(`get_run/${runId}`);
  }

  // Get results for a test run
  async getResultsForRun(runId: number): Promise<any> {
    return await this.makeRequest(`get_results_for_run/${runId}`);
  }

  // Get a specific test case
  async getCase(caseId: number): Promise<any> {
    return await this.makeRequest(`get_case/${caseId}`);
  }

  // Get all projects
  async getProjects(): Promise<any> {
    return await this.makeRequest('get_projects');
  }

  // Get all users
  async getUsers(): Promise<any> {
    return await this.makeRequest('get_users');
  }

  // Get tests for a run
  async getTests(runId: number): Promise<any> {
    return await this.makeRequest(`get_tests/${runId}`);
  }

  // Get test results for a specific test
  async getResultsForTest(testId: number): Promise<any> {
    return await this.makeRequest(`get_results/${testId}`);
  }

  // Get plans
  async getPlans(projectId: number): Promise<any> {
    return await this.makeRequest(`get_plans/${projectId}`);
  }

  // Get a specific plan
  async getPlan(planId: number): Promise<any> {
    return await this.makeRequest(`get_plan/${planId}`);
  }

  // Get suites for a project
  async getSuites(projectId: number): Promise<any> {
    return await this.makeRequest(`get_suites/${projectId}`);
  }

  // Get cases for a suite
  async getCases(projectId: number, suiteId?: number): Promise<any> {
    const endpoint = suiteId 
      ? `get_cases/${projectId}&suite_id=${suiteId}`
      : `get_cases/${projectId}`;
    return await this.makeRequest(endpoint);
  }
}
