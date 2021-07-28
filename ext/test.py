
def droppedRequests(reqList):
    req = {}
    for i in reqList:
        if i in req.keys():
            req[i] += 1
        else:
            req[i] = 1
    # print(req)

    transactions = 0
    droppedTransactions = 0
    for (sec, occur) in req.items():
        limit = 3
        for i in range(occur):
            if limit == 0:
                droppedTransactions += occur-3
                print("at sec {} dropped {} requests".format(sec, occur-3))
                break

            if sec <= 60 and transactions >= 60:

                droppedTransactions += occur-3
                transactions += 1
                # print("Tranactions = {}".format(transactions))
                print("At sec {} dropped {} requests".format(sec, occur-3))

            elif sec <= 10 and transactions >= 20:

                droppedTransactions += occur-3
                transactions += 1
                # print("Tranactions = {}".format(transactions))
                print("At sec {} dropped {} requests".format(sec, occur-3))

            else:

                transactions += 1
                limit -= 1

    print(droppedTransactions)


l = [
    [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5,
        5, 6, 6, 6, 7, 7, 7, 7, 11, 11, 11, 11, 12, 12, 12, 15, 15, 15],
]

droppedRequests(l[0])
