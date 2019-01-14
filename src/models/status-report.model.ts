export interface StatusReport {
  startdate: string;
  enddate: string;
  workdone: [
    {
      description: '';
    }
  ];

  workplanned: [
    {
      description: '';
    }
  ];

  /**
   * Wether or not the project is on track at this time.
   */
  projectOntrack: boolean;

  /**
   * Contains information about the hours worked during the project week. Requires a project to be billable on an hourly basis.
   */
  hours?: {
    /**
     * Number of hours tracked as billable. Divid by 100 to account for the decimal.
     */
    billable: number;

    /**
     * Number of hours tracked as nonbillable. Divid by 100 to account for the decimal.
     */
    nonbillable: number;

    /**
     * Total number of hours tracked. Divid by 100 to account for the decimal.
     */
    total: number;
  };

  /**
   * A list of items that feedback is requested in order to keep the project on timeline.
   */
  feedbackRequests: [
    {
      description: string;
    }
  ];
}
